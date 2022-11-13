const list = [];

//NEED TO DEFINE SOME FUNCTIONS FOR ADDING AND DELETING!

listAdd = (id, name) => {
    list.push({id, name});
    if(list.length > 10){
        list.shift();
    }
}

listDelete = (id) => {
    list = list.filter(element => element.id!== id);
}

toJson = () => {
    return list;
}

module.export = {
    listAdd,
    listDelete,
    toJson 
}