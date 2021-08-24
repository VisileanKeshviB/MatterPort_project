'use strict;'

//click to close the form
function closeForm(){
	document.getElementById("myForm").style.display="none";

}


const key = "3yabaz43gq6nkuyb3mddkfchd";
const params = "&help=0&play=1&qs=1&gt=0&hr=0";
const matSpace = "https://my.matterport.com/show/?m=";
let matSid = "u4HDZ3Z96Y4";
let iframe;
let addTagBtn;
let container;
let tag;
//let table_container;
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

//set dynamically

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.querySelector('.showcase');
    container = document.querySelector('.showcase_container');
    addTagBtn = document.querySelector('.add_tag');
    exportBtn = document.querySelector('.export_tags');
    removeBtn = document.querySelector('.remove_tags');
    fc=document.querySelector('.form-container');
    
    //form_container = document.querySelector("scroll");   
    
    iframe.setAttribute('src', `${matSpace}${matSid}${params}`);
    iframe.addEventListener('load', showcaseLoader, true);

   
})

//connecting to SDK

function showcaseLoader(){
    try{
        window.MP_SDK.connect(iframe, key, '3.2')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    } catch(e){
        console.log(e);
    }
}

//calculating the distance

function euclideanDistance3D(pos1, pos2){
    return Math.sqrt( 
        Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2) +
        Math.pow(pos1.z - pos2.z, 2)
     );
}

function removeElementsInside(ele){
    while(ele.firstChild){
        ele.removeChild(ele.lastChild);
    }
}

function c(f,m,l = false) {
	var dt = new Date().toJSON();
    if (l == true) {
		$('#listeners').prepend('<dt>' + f + '</dt><dd>' + m + '</dd>');
	}
	else {
		console.log(f + ' - ' + m);
		$('#content').prepend('<dt>' + f + '</dt><dd>' + m + '</dd>');
	}
	
}



//main function in which all the other functions/methods are declared

function loadedShowcaseHandler(mpSdk){
	
    let addingTag = false;
    let movingTag = false;
    
     var cScroll = new PerfectScrollbar('#content');
	cScroll.update();

	var lScroll = new PerfectScrollbar('#listeners');
	lScroll.update();
	
	if (typeof mpSdk.App.getLoadTimes != 'undefined') {
		console.log("----"+mpSdk.App.getLoadTimes())
		mpSdk.App.getLoadTimes()
		
			.then(function(results) {
				//c('mpSdk.App.getLoadTimes() (New in SDK v3.0.6)', JSON.stringify(results));
			})
			.catch(function(error) {
				//c('mpSdk.App.getLoadTimes()  (New in SDK v3.0.6)', 'Failed: ' + error);
			})
	}
	else {
		console.log('Could not use SDK v3.0.6');
	}
	
	//getting the model data
	
	var modelData;
	mpSdk.Model.getData()
		.then(function(model) {
			modelData = model;
			//console.log("--------"+model);
			//console.log(mpSdk.Model.getData());
			console.log("yes"+'mpSdk.Model.getData()',JSON.stringify(model,null,2));
		}).catch(function(error) {
			//c('mpSdk.Model.getData()', 'Failed: ' + error);
		}
	);
	
	//getting the model details
	var modelDetails;
	mpSdk.Model.getDetails()
		.then(function(details) {
			modelDetails = details;
			console.log(mpSdk.Model.getDetails());
			console.log("no"+'mpSdk.Model.getDetails()', JSON.stringify(details,null,2));
		}).catch(function(error) {
			//c('mpSdk.Model.getDetails()', 'Failed: ' + error);
		}
	);
	
	//click to open form
	
	function openForm(num){
	
	console.log('in form');
		document.getElementById("myForm").style.display="block";
		
		document.getElementById('last0').value=num;
		//console.log('accessing:'+);
		
	}
	
	//click event on tag
	
	mpSdk.on(mpSdk.Mattertag.Event.CLICK,
	  function(selectionSID){
	  		console.log('mpSdk.on(Sdk.Mattertag.Event.CLICK)', 'Selected: ' + selectionSID, true);
			mpSdk.Mattertag.getData()
			  .then(function(mattertags) {
				$.each(mattertags, function(key,mattertag) {
					if (mattertag.sid == selectionSID) {
					console.log("label"+'mpSdk.Mattertag.Label.getData()');
						console.log("sid"+'selectionSID');
						
						console.log('mpSdk.Mattertag.getData()(filtered by ' + selectionSID + ')', JSON.stringify(mattertag,null,2));
						var obj=JSON.parse(JSON.stringify(mattertag,null,2));
						console.log("first element"+obj["label"]);
						 openForm(obj["label"]);
						console.log("opening the form");
					}
				});
			  })
			  .catch(function(error) {
				console.log('mpSdk.on(Sdk.Mattertag.Event.CLICK)', 'Failed: ' + error, true);
			  });			
		}
	);		
    // Fetch tags
    mpSdk.Mattertag.getData()
    .then( (tags) => {
        mattertags = tags;
        //populateTags(tags);
        //setupTagFunctionality();
    })
    .catch(console.error);

	//add a new tag and place it

    function placeTag(){
	console.log("hello")
        if(tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.INSTANT);
        tag = null;
        movingTag = false;
    }
    
   

    if(!isFirefox){
        focusDetect();
    }

    function focusDetect(){
        const eventListener = window.addEventListener('blur', function() {
            if (document.activeElement === iframe) {
                placeTag(); //function you want to call on click
                setTimeout(function(){ window.focus(); }, 0);
            }
            window.removeEventListener('blur', eventListener );
        });
    }

    function overlayDetect(){
        if(tag){
            const overlay = document.createElement('div');
            overlay.setAttribute('class', 'click-overlay');
            overlay.addEventListener('mousemove', e => {
                mpSdk.Renderer.getWorldPositionData({
                    x: e.clientX - 30,
                    y: e.clientY - 5
                })
                .then(data =>{
                    updateTagPos(data.position); 
                })
                .catch(e => {
                    console.error(e);
                    placeTag();
                });
                
            });
            overlay.addEventListener('click', e => {
                placeTag();
                overlay.remove();
            });
            container.insertAdjacentElement('beforeend', overlay);
        }
    }

    function updateTagPos(newPos, newNorm=undefined, scale=undefined){
        if(!newPos) return;
        if(!scale) scale = .33;
        if(!newNorm) newNorm = {x: 0, y: 1, z: 0};

        mpSdk.Mattertag.editPosition(tag, {
            anchorPosition: newPos,
            stemVector: {
                x: scale * newNorm.x,
                y: scale * newNorm.y,
                z: scale * newNorm.z,
            }
        })
        .catch(e =>{
            console.error(e);
            tag = null;
            movingTag = false;
        });
    }

    mpSdk.Pointer.intersection.subscribe(intersectionData => {
        if(tag && !movingTag){
            if(intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep'){
                updateTagPos(intersectionData.position, intersectionData.normal);
            }
        }
    });

    addTagBtn.addEventListener('click', () => {
        if(!addingTag && !tag){
            addingTag = true;
            mpSdk.Mattertag.add([{
                label: "Matterport Tag",
                description: "",
                anchorPosition: {x: 0, y: 0, z: 0},
                stemVector: {x:0, y: 0, z: 0},
                color: {r: 1, g: 0, b: 0},
            }])
            .then((sid) => {
                tag = sid[0];
                return mpSdk.Mattertag.getData();
            })
            .then( (collection) => {
                const t_sid = collection.find( elem => elem.sid === tag);
                const row = addToTable(t_sid);
                addTagListeners(row);
                addingTag = false;
            })
            .then(() => {
                if(isFirefox) overlayDetect();
            })
            .catch( (e) => {
                console.error(e);
                addingTag = false;
            })
        }
    });

    function replaceShowcaseTags(tags){
        return mpSdk.Mattertag.getData()
        .then(oldTags => {
            oldTagSids = oldTags.map(oldTag => oldTag.sid);
            return mpSdk.Mattertag.remove(oldTagSids);
        })
        .then( () => {
            tags.forEach(tag => {
                tag.media.type = "mattertag.media." + tag.media.type
            });
            return mpSdk.Mattertag.add(tags);
        })
        .then(newSids => {
            tags.forEach( (tag, i) => tag.sid = newSids[i]);
            return tags;
        })
        .catch(e  => {
            console.error(`${e}: ${tags}`);
        });
    }

   
    removeBtn.addEventListener('click', () => {
        removeAllTags();
    })

   

    //to remove all the tags

    function removeAllTags(){
        mpSdk.Mattertag.getData()
        .then(tags => {
            return tags.map(tag => tag.sid);
        })
        .then(tagSids => {
            return mpSdk.Mattertag.remove(tagSids)
        })
        .catch(console.error);

        document.querySelectorAll('tr').forEach( block =>{
            if(!block || block.children[0].tagName == 'TH') return;
            block.parentNode.removeChild(block);
        });
    }


    function updateTag(matTagId, label=null, description=null){
        if(!label && !description) return;

        const props = new Object();
        label ? props['label'] = label : {};
        description ? props['description'] = description : {};

        mpSdk.Mattertag.editBillboard(matTagId, props)
        .catch( (e) => { console.error(e); });
    }

    function changeInfo(ele, tagId){
        if(ele.tagName === 'TH'){ return; }
        const desc = ele.innerText;
        const change = document.createElement('input');
        change.id = tagId;
        change.value = desc;
        ele.replaceWith(change);
        change.focus();
        change.addEventListener('blur', (e) => {
            clickAway(change, tagId);
        });
        change.addEventListener('keydown', (e) => {
            if(e.key == "Enter"){
                change.blur();
            }
        });
    }

    function clickAway(ele, tagId) {
        let desc = ele.value;
        const change = document.createElement('input');
        change.setAttribute('type','text');
        change.id = tagId;
        change.innerText = ele.value;
        ele.replaceWith(change);
        change.removeEventListener('blur', clickAway);
        const lbl = tagId === 'label' ? desc : null;
        desc = tagId === 'description' ? desc : null;
        updateTag(change.parentElement.id, label=lbl, description=desc);
        change.addEventListener('click', () =>{
            changeInfo(change, tagId);
        });
    };

    
    
    
 $(document).ready(function() {
  $('div').tooltip();
})


} // loadedShowcaseHandler







