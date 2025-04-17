# generate the sha256 like this:
# nix-prefetch-url --unpack https://github.com/nixos/nixpkgs/archive/bbd4c4b268f1c805b3b2653314ecd5582bfa9cf2.tar.gz
# Using the sha256 prevents re-fetching and/or checking etag from the network

let
  nixpkgs = fetchTarball {
    url = "https://github.com/nixos/nixpkgs/archive/bbd4c4b268f1c805b3b2653314ecd5582bfa9cf2.tar.gz";
    sha256 = "0ygrrfl5y2i0d6fdl2xf2pc97rkskrd53irhlxq965h6mw8ppimj";
  };
  pkgs = import nixpkgs { config = {}; overlays = []; };
in 

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_23
  ];
}
