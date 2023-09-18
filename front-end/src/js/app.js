const overlay = $('#overlay');
const btnUpload = $('#btn-upload')
const dropZone = $('#drop-zone');
const mainElm = $('main');
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = '<div class="lds-facebook"><div></div><div></div><div></div>';

btnUpload.on('click', ()=> overlay.removeClass('d-none'));

overlay.on('click',(evt)=> {
    if(evt.target === overlay[0]) overlay.addClass("d-none");
});
$(document).on('keydown', (evt) =>{
    if(evt.key === 'Escape') overlay.addClass('d-none')
} );
mainElm.on('click', (eventData)=>{
    let imgUrl = $(eventData.target).attr('data-url');
    downloadImage(imgUrl, "hi");
});
dropZone.on('dragover', (evt)=>{
    evt.preventDefault();
});
dropZone.on('drop',(evt)=>{
    evt.preventDefault();
    const droppedFiles = evt.originalEvent.dataTransfer.files;
    const imageFiles = Array.from(droppedFiles).
            filter(file => file.type.startsWith("image/"));
    if(!imageFiles.length) return;
    overlay.addClass('d-none');
    uploadImages(imageFiles);

})
overlay.on('dragover',(evt)=> evt.preventDefault());
overlay.on('drop',(evt)=> evt.preventDefault());
mainElm.on('click', '.image:not(.loader)', (evt)=>{
    evt.target.requestFullscreen();
});

loadAllImages();

function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $('<div class="image loader"></div>');
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);
        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`,{
        method: 'POST',
        data: formData,
        processData: false,
        contentType :false,
    });

    jqxhr.done((imageUrlList)=>{
        console.log("done");
        imageUrlList.forEach( (url) => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image',`url('${url}')`);
            divElm.empty();
            divElm.removeClass('loader');

        });
    });
    jqxhr.always(()=> $(".image.loader").remove());

}
function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    // $(link).attr('download');
    document.body.appendChild(link);
    link.click();
    document.body.remove(link);

}
function loadAllImages(){
    const jqhxr = $.ajax(`${REST_API_URL}/images`);
    jqhxr.done((imageUrlList)=>{
        imageUrlList.forEach(imgUrl => {
            let imageDiv = $(`<div class="image"></div>`);
            imageDiv.css('background-image', `url(${imgUrl})`);
            $('main').append(imageDiv);
            imageDiv.attr('data-url',imgUrl);
        })
    });
    jqhxr.fail(()=>{});
}





