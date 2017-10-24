#!/bin/bash  

# install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs

# install gcc
apt-get install -y python-software-properties
add-apt-repository ppa:ubuntu-toolchain-r/test
apt-get update
apt-get install -y gcc-4.8
update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50

# install make
apt-get install -y make

# install zeromq
add-apt-repository ppa:chris-lea/zeromq -y
apt-get update
apt-get install -y libzmq3-dev
ldconfig

# install libevent
apt-get install -y libevent-dev

# install pip if not already installed
apt-get install -y python-setuptools
apt-get install -y python-pip

# install zeromq bindings
pip install pyzmq

# install zerorpc
pip install zerorpc

# install node modules
npm config set unsafe-perm=true
npm install --save zerorpc
npm install zmq --save
npm install