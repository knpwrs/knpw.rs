---
title: "Creating and Scaling a Docker Swarm Cluster with Terraform"
date: "2017-06-04"
path: /blog/docker-swarm-terraform
tags: docker, terraform, devops
layout: post
---

[Terraform] is a tool made by [Hashicorp] which allows you to provision and
manage infrastructure on popular cloud providers. You define your infrastructure
as code in simple configuration files enabling repeatable deployments which are
simple to tear down and easy to make changes to. This article serves as an
introduction to [Terraform] by showing you how to create and scale a [Docker
Swarm] cluster on [DigitalOcean]. If you don't already have a [DigitalOcean]
account and would like to follow along you can use [this link][DigitalOcean] to
get $10 in free credit.

## Preparing [DigitalOcean]

Before getting started, you will need to generate an API token so [Terraform]
can access your [DigitalOcean] account. To generate an API token all you need to
do is log in to your account, click "API" in the top navigation bar, and then
click "Generate New Token." Give the token a name and make sure you enable read
and write access. Copy down the API token and keep it somewhere safe --
[DigitalOcean] will not show you the token again. If you lose the token you will
have to generate a new one.

## Generate a Public/Private Key-Pair

Use the following command to generate a public and private key-pair:

```sh
ssh-keygen -o -a 100 -t ed25519 -C dockerswarm@digitalocean
```

By default this will create two files: `~/.ssh/id_ed25519` and
`~/.ssh/id_ed25519.pub`. When the command runs you will have an opportunity to
use a different location if you want. Make sure you use a strong passphrase when
generating the key. Once the keys are generated use the following command to add
the private key to your SSH agent:

```sh
ssh-add ~/.ssh/id_ed25519
```

## First Steps With [Terraform]

First you have to [install Terraform][install]. If you are on macOS with
[Homebrew] installed this is as simple as running `brew install terraform`.
Otherwise simply follow the [installation instructions][install] for your
platform.

Once installed you can begin writing your configuration files. In an empty
directory make a file called `variables.tf` with the following contents:

```
variable "do_token" {
  description = "Your Digital Ocean API token"
}

variable "public_key_path" {
  description = "Path to the SSH public key to be used for authentication"
}

variable "do_key_name" {
  description = "Name of the key on Digital Ocean"
  default = "terraform"
}
```

This file defines [variables] you can use throughout your [Terraform]
configuration. The `do_key_name` variable has a default value so you don't have
to explicitly initialize it with another value. When you run the `terraform`
command it will ask you for values to use for the other [variables]. If you
don't want to enter values every time you run `terraform` (I know I don't!) then
you can create a file called `terraform.tfvars` which defines values for
[variables]:

```
do_token="DIGITALOCEAN API TOKEN"
public_key_path="~/.ssh/id_ed25519.pub"
```

Now create a file called `main.tf` with the following contents:

```
provider "digitalocean" {
  token = "${var.do_token}"
}

resource "digitalocean_ssh_key" "default" {
  name = "${var.do_key_name}"
  public_key = "${file(var.public_key_path)}"
}
```

The first block defines credentials to use for the [DigitalOcean] provider. The
second block defines a resource for [Terraform] to create and manage. In this
case we are adding a public key to our [DigitalOcean] account. The `resource`
block is defined with `TYPE` and `NAME` parameters. Configuration for the
resource goes inside the curly braces. The difference between the `NAME`
parameter and the `name` configuration is that `NAME` is only used within
[Terraform] (in our case, to refer to the resource) whereas `name` is a
configuration parameter for the resource (in this case, `name` will define how
the key is displayed in your [DigitalOcean] account). The `${}` syntax is how
[Terraform] does [string interpolation]. Here, we are referencing the
[variables] we defined and using them as strings in our provider and resource
configuration.

At this point you should have three files: `variables.tf`, `main.tf`, and
`terraform.tfvars`. Run the following command:

```sh
terraform plan
```

Assuming you did everything properly `terraform` will report that it will add a
public key to your [DigitalOcean] account when the plan is applied. To apply the
plan, just run:

```sh
terraform apply
```

You should see a message that says, `Apply complete! Resources: 1 added, 0
changed, 0 destroyed.` Now if you run `terraform plan` again you will see a
message which says, `No changes. Infrastructure is up-to-date.` This is an
important concept in understanding the power of a tool like [Terraform]. To make
changes to your infrastructure you just need to update the configuration files
and run `terraform apply`. `terraform` will only perform the changes required to
make your infrastructure match the new configuration. You don't have to run
`terraform plan`, but it's a good idea to always look at the plan before
applying changes, even if your changes seem benign.

Note: the names of your `.tf` files doesn't actually matter. When you use the
`terraform` command it will load all files in the current directory with the
`.tf` extension. As you will see shortly, this works because the order you
declare resources in [Terraform] doesn't matter. If you really wanted to you
could put everything in any order in one `.tf` file. This only applies to `.tf`
files, your variable values must be defined in `terraform.tfvars`.

## Setting up the [Docker Swarm] Manager

Adding a public key to your [DigitalOcean] account is cool and all, but it's not
terribly exciting. Let's set up a machine to act as the Docker Swarm manager
node. Add the following to `main.tf`:

```
resource "digitalocean_droplet" "docker_swarm_manager" {
  name = "docker-swarm-manager"
  region = "nyc3"
  size = "512mb"
  image = "ubuntu-16-04-x64"
  ssh_keys = ["${digitalocean_ssh_key.default.id}"]
  private_networking = true

  provisioner "remote-exec" {
    script = "install-docker.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm init --advertise-addr ${digitalocean_droplet.docker_swarm_manager.ipv4_address_private}"
    ]
  }
}
```

This block defines a droplet (virtual machine) to create on [DigitalOcean]. Most
of the parameters are self-explanatory though there are a few things to call
out. First, the configuration for `ssh_keys`. You can directly use the id or
fingerprint of a public key in your [DigitalOcean] account; however, since we
created a `digitalocean_ssh_key` resource with [Terraform] we can directly
reference it here without having to look it up. The `ssh_keys` configuration
takes a list of strings as a value. Here, we are interpolating the id attribute
of the key into a string. The syntax for referencing an attribute from a
resource is `TYPE.NAME.ATTR`, hence `digitalocean_ssh_key.default.id`.

The configuration block also contains two provisioners. One copies a script,
`install-docker.sh` to the machine and runs it. The contents of
`install-docker.sh` are:

```sh
#!/usr/bin/env bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
```

You should also make sure the file is executable:

```sh
chmod +x install-docker.sh
```

The steps executed by this script are covered on [Docker's Official
Website][install-docker].

The second provisioner runs a command on the machine. We use [string
interpolation] to set the IP address the swarm manager listens on. Once again,
we use the `TYPE.NAME.ATTR` syntax, this time to get the private IP address of
the machine.

To get a list of `region`s, `size`s, and `image`s available to use you can use
the [DigitalOcean API]. It's also worth noting that for the `image` we could
have used `docker-16-04` instead of `ubuntu-16-04-x64`. I used the Ubuntu base
image because I prefer to install my own software rather than start with
pre-configured images. This also lets us demonstrate using a provisioner to
install software on the remote machine.

Run `terraform plan`. You will see that the plan calls for one machine to be
created. Run `terraform apply` and the machine will be created and provisioned
with [Docker] installed.

## Adding Worker Nodes

Now that we understand [Terraform] a little more we can start going a little
faster. Add the following to `main.tf`:

```
resource "digitalocean_droplet" "docker_swarm_worker" {
  count = 3
  name = "docker-swarm-worker-${count.index}"
  region = "nyc3"
  size = "512mb"
  image = "ubuntu-16-04-x64"
  ssh_keys = ["${digitalocean_ssh_key.default.id}"]
  private_networking = true

  provisioner "remote-exec" {
    script = "install-docker.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm join --token ${data.external.swarm_join_token.result.worker} ${digitalocean_droplet.docker_swarm_manager.ipv4_address_private}:2377"
    ]
  }
}
```

This is very similar to the last resource block. We're even reusing the same
`install-docker.sh` script from the manager resource block. The first key
difference is that we supply a `count` configuration and set the value to `3`.
This tells [Terraform] that we want three of this resource. We name the
resources accordingly by interpolating the index of each resource into the name
of the resource.

The second key difference is that instead of initializing a swarm manager node
we have this machine join the swarm as a worker node. In order to do that we
need to retrieve the worker join token from the manager node as well as the IP
address of the manager node. We already know how to get the manager node IP
address -- the same exact way we got it before when we set up the node's
listening address. To get the worker join token we can define an external data
source. Add the following to `main.tf`:

```
data "external" "swarm_join_token" {
  program = ["./get-join-tokens.sh"]
  query = {
    host = "${digitalocean_droplet.docker_swarm_manager.ipv4_address}"
  }
}
```

We reference the data provided from this block via `data.TYPE.NAME.result.ATTR`,
or in our case, `${data.external.swarm_join_token.result.worker}`. The program
is an executable separate from `terraform` which accepts a `query` through
`stdin` as a JSON object and returns back a JSON object over `stdout`. You can
use any language you like, but for our purposes it is simple enough to write a
shell script. Create a file called `get-join-tokens.sh` with the following
contents:

```
#!/usr/bin/env bash

# Exit if any of the intermediate steps fail
set -e

# Extract input variables
eval "$(jq -r '@sh "HOST=\(.host)"')"

# Get worker join token
WORKER=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@$HOST docker swarm join-token worker -q)
MANAGER=$(ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@$HOST docker swarm join-token manager -q)

# Pass back a JSON object
jq -n --arg worker $WORKER --arg manager $MANAGER '{"worker":$worker,"manager":$manager}'
```

And make sure the file is executable:

```sh
chmod +x get-join-tokens.sh
```

In order for this script to work you must have `jq` installed on the same
machine you are running `terraform` on. If you are on macOS with [Homebrew]
installed this is as simple as running `brew install jq`. `jq` is a small
utility which lets you deal with JSON directly in your shell without having to
write weird `sed` things. The script receives a `host` parameter which it uses
to execute two commands on the remote host over `ssh`. The first command
retrieves the worker join token, and the second command retrieves the manager
join token (not explicitly required for what we're doing, but it's still handy
to have).

If you run `terraform plan` you should see that `terraform` plans on creating
three new machines. Run `terraform apply` to get three new machines and have
them join the [Docker Swarm] cluster. The machines will be created in parallel
since they do not have any dependencies between each other, they only depend on
the manager node. If you didn't already run `terraform apply` from before then
`terraform` will create and provision the manager node first and then create and
provision the worker nodes.

## Deploying a Service to the [Docker Swarm] Cluster

We now have a four-machine [Docker Swarm] cluster running on [DigitalOcean]. How
do we deploy a service to the cluster? We'll have to `ssh` in to the manager
node and run a command there. How do we `ssh` into the manager node without
knowing its IP address off hand? We could look up the IP address in our
[DigitalOcean] control panel; however, [Terraform] has a better way: [output
variables][outputs]. Create a file called `outputs.tf` with the following
contents:

```
output "manager_public_ip" {
  value = "${digitalocean_droplet.docker_swarm_manager.ipv4_address}"
}
```

With that file created run `terraform apply`. There won't be any changes made to
our infrastructure; however, after `terraform apply` has run we will see the
public IP address of the manager node. We can also retrieve the IP address at
any time with the following command:

```sh
terraform output manager_public_ip
```

With that available to us, we can `ssh` into the manager node as such:

```sh
ssh root@$(terraform output manager_public_ip)
```

Now that we are in the machine, we can deploy, for example, an `nginx` service
with two replicas:

```sh
docker service create -d --name nginx -p 80:80 --replicas 2 nginx
```

Wait just a bit, and you can see that two replicas of `nginx` have been deployed
across the swarm:

```
$ docker service ps nginx
ID                  NAME                IMAGE               NODE                    DESIRED STATE       CURRENT STATE           ERROR               PORTS
x21ipowx6fjo        nginx.1             nginx:latest        docker-swarm-worker-1   Running             Running 3 seconds ago
pjq7e6yzlnxt        nginx.2             nginx:latest        docker-swarm-worker-2   Running             Running 3 seconds ago
```

In this case you can see that the two replicas have been deployed to two of the
worker nodes. To access your service you can use any of the public IP addresses
in the swarm, including the manager node or `docker-swarm-worker-0`, neither of
which have the service deployed on them. Back on your local machine:

```sh
curl $(terraform output manager_public_ip)
```

You should see some generic nginx welcome HTML in your terminal. Huzzah!

## Adding a Public Load Balancer

So now with the swarm set up, how do we let others access our service? We could
give everyone the IP address of our manager node, or of any other arbitrary
node, but there's a better way. Let's use [Terraform] to provision a public load
balancer! This will require a few changes. First, add the following to
`main.tf`:

```
resource "digitalocean_tag" "docker_swarm_public" {
  name = "docker-swarm-public"
}

resource "digitalocean_loadbalancer" "public" {
  name = "docker-swarm-public-loadbalancer"
  region = "nyc3"
  droplet_tag = "${digitalocean_tag.docker_swarm_public.name}"

  forwarding_rule {
    entry_port = 80
    entry_protocol = "http"
    target_port = 80
    target_protocol = "http"
  }

  healthcheck {
    port = 22
    protocol = "tcp"
  }
}
```

By now you should be able to read [Terraform] configuration files. Here we're
defining a tag to use identity our machines as well as a load balancer which
will balance traffic between machines which have that tag. To tag our machines,
we'll have to edit the resource blocks to reference the tags:

```
resource "digitalocean_droplet" "docker_swarm_manager" {
  # ...
  tags = ["${digitalocean_tag.docker_swarm_public.id}"]
  # ...
}

resource "digitalocean_droplet" "docker_swarm_worker" {
  # ...
  tags = ["${digitalocean_tag.docker_swarm_public.id}"]
  # ...
}
```

One more step. Add an output variable to `outputs.tf` for the public IP address
of the load balancer:

```
output "loadbalancer_public_ip" {
  value = "${digitalocean_loadbalancer.public.ip}"
}
```

If you run `terraform plan` you will see that `terraform` plans to _modify_ all
four machines by adding a tag to them. This operation does not require
restarting or recreating the machines. It will also provision a load balancer.
Run `terraform apply`. When everything is done you'll see an IP address you can
use to access the load balancer. You can also access the load balancer similarly
to how we accessed the manager node before:

```sh
curl $(terraform output loadbalancer_public_ip)
```

Which node did the output come from? It doesn't matter. The load balancer gave
our request to one of the nodes. The swarm took over from there, routing our
request to an available service.

## Scaling Horizontally

Horizontal scaling means to add more nodes to the swarm so we can handle more
containers and services. Now that everything is set up it is super easy to
horizontally scale our swarm. Simply update the `count` configuration for the
worker nodes. For instance, if you change it from `3` to `5` and run `terraform
plan` you will see that it plans to create and provision two new worker nodes.
Because of our tag the machines will automatically be added to the public load
balancer.

What if we want to scale down? It turns out we've created too many machines and
we simply don't need them all. Well, change `5` down to say, `1` and run
`terraform plan`. You will see that `terraform` plans to destroy four machines.
What if one of those machines has a service replica deployed to it? In the case
of [Docker Swarm] this isn't a big deal. When a machine goes down or leaves the
swarm [Docker Swarm] is smart enough to deploy new replicas on the machines
which remain a part of the swarm. You can verify this by changing the count to
`1`, running `terraform apply` and then accessing the manager node via `ssh`:

```
$ ssh root@$(terraform output manager_public_ip)
$ docker service ps nginx
ID                  NAME                IMAGE               NODE                    DESIRED STATE       CURRENT STATE                 ERROR               PORTS
q0n2j4vqva2j        nginx.1             nginx:latest        docker-swarm-worker-0   Running             Running about a minute ago
x21ipowx6fjo         \_ nginx.1         nginx:latest        docker-swarm-worker-1   Shutdown            Running 30 minutes ago
nobk0pw4pq57        nginx.2             nginx:latest        docker-swarm-manager    Running             Running about a minute ago
mis7c3lc5e4y         \_ nginx.2         nginx:latest        docker-swarm-worker-4   Shutdown            Assigned about a minute ago
pjq7e6yzlnxt         \_ nginx.2         nginx:latest        docker-swarm-worker-2   Shutdown            Running 30 minutes ago
```

You can see that as machines were destroyed [Docker Swarm] moved the replicas
around to ensure that we always had two replicas of the `nginx` service
available.

## Scaling Vertically

Scaling vertically means to add more resources (ram, cpu, disk, network, etc) to
the machines we already have rather than simply adding more machines to the
swarm. Scaling out horizontally is easy, just add more machines by changing a
single parameter! Scaling vertically, however, is a bit more involved and
outside the scope of this article. The problem is that vertically scaling a
machine requires the machine to be temporarily shut down. [Terraform] would do
this to our machines in parallel meaning that we'd lose our swarm while it is
scaling. Not good!

The solution is to force `terraform` to run serially:

```sh
terraform apply --parallelism 1
```

This will make `terraform` modify only one machine at a time instead of all at
once. This will take a while, but it is better than having the entire swarm go
down.

Another workaround is to add brand new larger machines to the swarm and then
slowly destroy the smaller machines. In this case you would add the larger
machines as new resources, run `terraform apply`, and then reduce the count of
the smaller machines until you're ready to remove the small machine
configuration altogether (which tells `terraform` to destroy the machines). It
is also worth noting for this approach that [Docker Swarm] lets you have
multiple manager nodes in one swarm. Before destroying any  smaller resources it
would be a good idea to add a large manager node to the swarm, then you can
safely remove all the smaller resources.

## Cleaning Up

To clean up everything just run the following command:

```
terraform destroy
```

This will destroy and remove everything `terraform` has created and managed for
you. Everything from the public ssh key in your [DigitalOcean] account to the
machines and load balancer you created will be gone. If you want to see what
`terraform destroy` will do before you run it you can use:

```
terraform plan -destroy
```

Along the way we were executing `terraform apply` to make changes to our
infrastructure. We happened to go in an order that allowed `terraform` to
incrementally build our infrastructure. That said, now that we have nothing
`terraform plan` and `terraform apply` will still work. If you run `terraform
apply` you will see `terraform` create a public key in your [DigitalOcean]
account in parallel with a load balancer. After the key is created (though not
necessarily after the load balancer is created) `terraform` will make a machine
to act as the [Docker Swarm] manager node. After the manager node has been
created it will make the worker nodes and all of the nodes will be publicly load
balanced. `terraform` knows the order it needs to create resources in regardless
of the order you define resources in because it is able to infer dependencies
between resources based on the attributes you use to configure resources.

## Usages

We just demonstrated demonstrated using [Terraform] to create and manage
infrastructure. However, usage of [Terraform] is not limited to simply
provisioning production infrastructure. Consider the following use cases.

### Staging Environments

Now that you have a command to spin up infrastructure at will you can create
identical environments very easily. With one more variable to control resource
names you can create an identical staging environment to try out new things in.
If anything gets messed up beyond repair just run `terraform destroy &&
terraform apply` and you're back to good as new!

### Test Environments

With [Terraform] you can easily spin up new infrastructure for the sole purpose
of running end-to-end tests before a production deployment. In an era where
cloud providers charge by the hour it is very cheap to provision and tear down
infrastructure on a whim.

### Demo Environments

In a similar vein to spinning up environments for the sole purpose of testing
you can spin up environments for the sole purpose of demos. Who needs to demo
off of staging or production when you can get a fresh environment lickety–split?

### Customer Environments

Finally, in the case where you want to run individual customers on their own
infrastructure it's easy to spin up identical infrastructure as needed. Not only
is spinning up new infrastructure simple but updating existing infrastructure is
dead simple. Need to add an extra web server to a bunch of identical
environments? No problem. Some customers require more resources than others?
[Variables] to the rescue!

## Odds and Ends

### Configuration Management ([Chef])

[Terraform] is explicitly [not a configuration management tool][vs-chef]. You
may have noticed that we didn't follow basic security measures in setting up our
nodes. We didn't set up a firewall, turn off SSH password access, turn off root
access over SSH, or even create non-root users. These tasks are better left to a
tool like [Chef] which will make configuration easier to manage throughout the
lifetime of your resources. [Terraform] even ships with a [Chef provisioner]
which will install, configure, and run the [Chef] client on a remote resource
and a [Chef provider] which can manage resources that exist within a [Chef]
server.

### Other Resources and Providers

[Terraform] is not limited to spinning up virtual hardware in the cloud. It can
provision DNS ([DNSimple], [CloudFlare], [etc]), source code repositories
(including setting up webhooks for [GitHub], [GitLab], and [BitBucket]), bare
metal servers ([Packet], [Scaleway], [etc]), most resources on [AWS] and [GCP],
resources within databases ([PostgreSQL], [MySQL]), and even set up services
like [PagerDuty] and [Mailgun]. [Terraform] has a lot of capabilities -- I've
only really scratched the surface here. Be sure to check out [the full list of
official providers][etc] as well as [the documentation for official
provisioners][provisioners].

### Managing Configuration

Since infrastructure in [Terraform] is represented as code it is very easy to
check in to version control. It's a good idea to make a commit before running
`terraform apply`, and you should never run `terraform apply` more than once
without committing in between -- you're just inviting a world full of hurt
otherwise.

You may also want to refactor common configuration into [variables]. For
instance, I used the same droplet size for all of my nodes -- that could have
been a variable. For an example that uses more [variables], check out [this
post's accompanying repository][gh].

On the topic of [variables], it's a good idea to keep sensitive information
(such as your [DigitalOcean] API token) in variables. If you use a
`terraform.tfvars` file that has sensitive information in it you should place
that file in your `.gitignore` so it doesn't get committed.

For more information on [variables], check out the [official variables
documentation][variables].

### [Backends]

Throughout this article we've been running and provisioning everything from our
local machine. But what if we're working on a team and we want to share the
state of our infrastructure? What if provisioning resources will just take a
long time and we don't want to depend on our local machine being available?
That's where [backends] come in. [Terraform] supports a number of [backends]
including [S3] and [gcs], be sure to check out the full list of [backend types].

### What if I want to manage my existing infrastructure with [Terraform]?

If you have existing infrastructure you'd like to start managing with
[Terraform] you're in luck. [Terraform] has a mechanism which allows you to
[import existing infrastructure][import]. The specifics are outside the scope of
this article, but if you find yourself wanting to let [Terraform] manage
existing infrastructure be sure to check out [the page on importing existing
infrastructure][import].

## Conclusion

[Terraform] is a powerful tool which makes provisioning and managing
infrastructure easy. While other tools like [Chef] are focused on managing how
software and configuration is deployed across existing infrastructure,
[Terraform] is focused on the (virtual) hardware side of things allowing you to
easily and repeatedly deploy and update infrastructure. Whether you're looking
to quickly try things out on [your favorite cloud provider][DigitalOcean] or you
need a way to reliably manage large pieces of infrastructure, [Terraform] is
likely the tool for you. Feel free to check out [this article's accompanying
GitHub repository][gh] for a complete working example.

[AWS]: https://www.terraform.io/docs/providers/aws/index.html "Terraform Amazon Web Services Provider"
[backend types]: https://www.terraform.io/docs/backends/types/index.html "Terraform Backend Types"
[Backends]: https://www.terraform.io/docs/backends/index.html "Terraform Backends"
[BitBucket]: https://www.terraform.io/docs/providers/bitbucket/index.html "Terraform BitBucket Provider"
[Chef Provider]: https://www.terraform.io/docs/providers/chef/index.html "Terraform Chef Provider"
[Chef Provisioner]: https://www.terraform.io/docs/provisioners/chef.html "Terraform Chef Provisioner"
[Chef]: https://www.chef.io/ "Chef"
[CloudFlare]: https://www.terraform.io/docs/providers/cloudflare/index.html "Terraform CloudFlare Provider"
[DigitalOcean API]: https://developers.digitalocean.com/documentation/v2/ "DigitalOcean API"
[DigitalOcean]: https://m.do.co/c/41b1b93b4c2d "$10 Free Credit on DigitalOcean"
[DNSimple]: https://www.terraform.io/docs/providers/dnsimple/index.html "Terraform DNSimple Provider"
[Docker Swarm]: https://docs.docker.com/engine/swarm/ "Docker Swarm"
[Docker]: https://www.docker.com/ "Docker"
[etc]: https://www.terraform.io/docs/providers/index.html "Terraform Official Providers"
[GCP]: https://www.terraform.io/docs/providers/google/index.html "Terraform Google Cloud Platform Provider"
[gcs]: https://www.terraform.io/docs/backends/types/s3.html "Terraform gcs Backend"
[gh]: https://github.com/knpwrs/docker-swarm-terraform "knpwrs/docker-swarm-terraform"
[GitHub]: https://www.terraform.io/docs/providers/github/index.html "Terraform GitHub Provider"
[GitLab]: https://www.terraform.io/docs/providers/gitlab/index.html "Terraform GitLab Provider"
[Hashicorp]: https://www.hashicorp.com/ "Hashicorp"
[Homebrew]: https://brew.sh/ "Homebrew Package Manager"
[import]: https://www.terraform.io/docs/import/index.html "Terraform Import"
[install-docker]: https://docs.docker.com/engine/installation/linux/ubuntu/ "Get Docker for Ubuntu"
[install]: https://www.terraform.io/intro/getting-started/install.html "Install Terraform"
[Mailgun]: https://www.terraform.io/docs/providers/mailgun/index.html "Terraform Mailgun Provider"
[MySQL]: https://www.terraform.io/docs/providers/mysql/index.html "Terraform MySQL Provider"
[outputs]: https://www.terraform.io/docs/configuration/outputs.html "Output Variables"
[Packet]: https://www.terraform.io/docs/providers/packet/index.html "Terraform Packet Providers"
[PagerDuty]: https://www.terraform.io/docs/providers/pagerduty/index.html "Terraform PagerDuty Provider"
[PostgreSQL]: https://www.terraform.io/docs/providers/postgresql/index.html "Terraform PostgreSQL Provider"
[provisioners]: https://www.terraform.io/docs/provisioners/index.html "Terraform Official Provisioners"
[S3]: https://www.terraform.io/docs/backends/types/s3.html "Terraform S3 Backend"
[Scaleway]: https://www.terraform.io/docs/providers/scaleway/index.html "Terraform Scaleway Provider"
[string interpolation]: https://en.wikipedia.org/wiki/String_interpolation "String Interpolation"
[Terraform]: https://www.terraform.io/ "Terraform"
[variables]: https://www.terraform.io/docs/configuration/variables.html "Terraform Variables"
[vs-chef]: https://www.terraform.io/intro/vs/chef-puppet.html "Terraform vs. Chef, Puppet, etc."
