require 'bundler'
Bundler.require
lib = "./lib"
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require_relative 'lib/sh'
require 'lanes/api'
run Lanes::API::Root
