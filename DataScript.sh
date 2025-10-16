#!/bin/bash
apt update -y

apt install -y nginx
systemctl start nginx
systemctl enable nginx

apt install -y unzip curl
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -f /var/www/html/index.nginx-debian.html
aws s3 cp s3://bryan-tejaxun-nclouds-connect-2025/ /var/www/html/ --recursive