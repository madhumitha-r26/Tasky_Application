const state={
    taskList:[],
};

// DOM Operations

const taskContents= document.querySelector(".task__contents");
const taskModal= document.querySelector(".task__modal__body");

// console.log(taskContents);
// console.log(taskModal);

const htmlTaskContent = ({id,title,description,type,url}) => `
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
        <div class='card-header d-flex justify-content-end task__card__header'>
            <button type='button' class='btn btn-primary mr-1.5' name='${id}'>
            <i class='fa fa-pencil' name='${id}'></i>
            </button>
            <button type='button' class='btn btn-danger mr-1.5' name='${id}'>
            <i class='fa fa-trash' name='${id}'></i>
            </button>
        </div>

         <div class='card-body'>
           ${
                url && //if it exists
                `<img width='100%' src='${url} alt='Card Image' class='card-img-top md-3'>`
           }
                <h4 class='card-title task__card__title'>${title}</h5>
                <p class='description trim-3 lines'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
         
        </div>

        <div class='card-body'>
            <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle="modal" data-bs-target="#showTask">Open</button>
        </div>
    </div>
</div> `;

const htmlModalContent=({id,title,description,url})=>{
    const date = new Date(parseInt(id));
    return `
        <div id= ${id}>
            ${
                url &&
                `<img width='100%' src='${url}' alt='Card Image' class='img-fluid place__holder__image mb-3'/> `
            }
            <strong class='text-muted text-sm'>Created on:${date.toDateString()}</strong>
            <h2 class='my-3'>${title}</h2>
            <p class='text-muted'>${description}</p>

        </div>`
};

const updatelocalstorage=() =>{
    localStorage.setItem(
    "tasky",
    JSON.stringfy({
        tasks:state.taskList,
    })
    )
};