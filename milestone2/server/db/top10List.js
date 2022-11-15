let list = [];

//NEED TO DEFINE SOME FUNCTIONS FOR ADDING AND DELETING!

listAdd = (id, name) => {
    list.splice(0, 0,{id: id, name: name});
}

listDelete = (id) => {
    list = list.filter(element => element.id!= id);
}

toJson = () => {
    if(list.length > 10){
        return list.slice(0, 10);
    }
    else{
        return list;
    }
}

module.exports = {
    listAdd,
    listDelete,
    toJson
}