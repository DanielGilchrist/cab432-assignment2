#!/bin/bash  

# install zeromq
wget https://download.opensuse.org/repositories/network:/messaging:/zeromq:/release-stable/Debian_9.0/Release.key -O- | sudo apt-key add
apt-get install libzmq3-dev

# install libevent
apt-get install libevent-dev

# run ldconfig
ldconfig

# install pip if not already installed
apt-get install python-setuptools
apt-get install python-pip
pip install pyzmq

# install zeromq bindings
pip install pyzmq

# install zerorpc
pip install zerorpc

# install node module
npm install --save zerorpc
npm install zmq --save --unsafe-perm