let list = [];

//NEED TO DEFINE SOME FUNCTIONS FOR ADDING AND DELETING!

listAdd = (id, name) => {
    list.splice(0, 0,{id: id, name: name});
}

listDelete = (id) => {
    console.log("hi i'm trying to delete a list");
    list = list.filter(element => element.id!= id);
}

toJson = () => {
    console.log(list);
    if(list.length > 10){
        return list.slice(0, 10);
    }
    else{
        return list;
    }
}

moveDoc = (docID, name) => {
    let search = {id: docID, name: name}
    let index = list.filter(element => element.name != name);
    list.splice(0, 0, search);
}

module.exports = {
    listAdd,
    listDelete,
    toJson,
    moveDoc
}