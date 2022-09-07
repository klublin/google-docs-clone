#!/bin/bash

#link used: https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-20-04
#instead of binding ip to the tcp port, can also change bind_ip to 0.0.0.0

MONGOIMPORT=mongoimport
SOURCE=/root/factbook.json           # assume working folder (as root)

function import_file {
  echo "  importing >${1}<..."
  ${MONGOIMPORT} --db testHW2 --collection factbook --file ${1}
}

function import_region {
  for file in ${SOURCE}/$1/*.json
  do
    echo ${file}
    import_file ${file}
  done
}

#THIS ONLY WORKS IF THE SHELL SCRIPT FILE IS INSIDE factbook.json dir(still want to figure out if way to loop through directory
for dir in */
do 
  import_region ${dir}
done



