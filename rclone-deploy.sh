#/usr/bin/env bash

# Requires ACCESS_KEY_ID and SECRET_ACCESS_KEY environment variables to be set.

CONFIG_FILE=./rclone.conf
RCLONE_DIR=rclone-v$RCLONE_VERSION-linux-amd64
RCLONE_ZIP=$RCLONE_DIR.zip

# Write rclone config file
echo "[s3]" > $CONFIG_FILE
echo "type = s3" >> $CONFIG_FILE
echo "env_auth = false" >> $CONFIG_FILE
echo "access_key_id = $ACCESS_KEY_ID" >> $CONFIG_FILE
echo "secret_access_key = $SECRET_ACCESS_KEY" >> $CONFIG_FILE
echo "region = us-east-1" >> $CONFIG_FILE
echo "endpoint = " >> $CONFIG_FILE
echo "location_constraint = " >> $CONFIG_FILE
echo "acl = " >> $CONFIG_FILE
echo "server_side_encryption = " >> $CONFIG_FILE
echo "storage_class = " >> $CONFIG_FILE

# Get rclone
wget https://github.com/ncw/rclone/releases/download/v$RCLONE_VERSION/$RCLONE_ZIP
unzip $RCLONE_ZIP

# Sync with S3
echo "Syncing with S3..."
./$RCLONE_DIR/rclone --config $CONFIG_FILE sync ./public s3:knpw.rs
echo "Done syncing with S3"

# Delete configuration and binaries
echo "Cleaning up rclone files..."
rm rclone.conf
rm $RCLONE_ZIP
rm -r $RCLONE_DIR
echo "Done cleaning up rclone files..."
