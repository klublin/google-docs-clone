#!/bin/bash

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

for dir in */
do 
  import_region ${dir}
done



