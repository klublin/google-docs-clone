let list = [];

//NEED TO DEFINE SOME FUNCTIONS FOR ADDING AND DELETING!

listAdd = (id, name) => {
    list.push({id: id, name: name});
    if(list.length > 10){
        list.shift();
    }
}

listDelete = (id) => {
    console.log("hi i'm trying to delete a list");
    console.log(list);
    console.log(id);
    list = list.filter(element => element.id!= id);
    console.log(list);
}

toJson = () => {
    return list;
}

module.exports = {
    listAdd,
    listDelete,
    toJson 
}