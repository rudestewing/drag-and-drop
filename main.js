const items = document.querySelectorAll('.item.allowed-move');
const abandoned = document.querySelector('#abandoned ul');
var currentSlot = null;
var isMouseDown = false;
var container = null;
var oldContainer = null;

function setStatic(item) {
    item.style.position = 'static';
}

function setAbsolute(item) {
    item.style.position = 'absolute';
}

function snapItem(item) {
    if(isMouseDown == false) {
        if(container.classList.contains('slot') && container.classList.contains('allowed') ) {
            // snap to new container
            let box = container.getBoundingClientRect();
            item.style.left = box.x + 'px';
            item.style.top = box.y + 'px';
            container.appendChild(item);
            item.closest('.slot').querySelector('input[type="checkbox"]').checked = true;
        } else {
            // snap to old container
            let box = oldContainer.getBoundingClientRect();
            item.style.left = box.x + 'px';
            item.style.top = box.y + 'px';
            oldContainer.appendChild(item);
            setStatic(item);
        }
    }
}

function enterSlot(element, item) {
    element.classList.add('over');
    item.addEventListener('mouseup', () => {
        isMouseDown = false;
        snapItem(item);
    });
}

function leaveSlot(element, item) {
    element.classList.remove('over');
}

function findElement(event, item) {
    // hidden dragged item
    item.hidden = true;

    // find element below cursor
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    
    // show dragged item again
    item.hidden = false;

    return elemBelow;
}

function onMouseDown(event1) {
    oldContainer = event1.target.closest('.slot');
    isMouseDown = true;
    var item = event1.target;
    
    let shiftX = event1.clientX - item.getBoundingClientRect().left;
    let shiftY = event1.clientY - item.getBoundingClientRect().top;
    
    item.style.position = 'absolute';
    item.style.zIndex = 1;
    document.body.append(item);

    function moveAt(pageX, pageY) {
        item.style.left = pageX - shiftX + 'px';
        item.style.top = pageY - shiftY + 'px';
    }

    moveAt(event1.pageX, event1.pageY);
 
    function onMouseMove(event2) {
        moveAt(event2.pageX, event2.pageY);

        let elemBelow = findElement(event2, item);
        if (!elemBelow) return;

        container = elemBelow;
        let droppableSlot = elemBelow.closest('.slot');
        if(currentSlot != droppableSlot) {
            if(currentSlot) {
                leaveSlot(currentSlot, item);
            }
            currentSlot = droppableSlot;
            if(currentSlot) {
                enterSlot(currentSlot, item);
            }
        }

    }

    document.addEventListener('mousemove', onMouseMove);

    item.addEventListener('mouseup', () => {
        isMouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    });

}


Array.from(items).forEach((item, index) => {
    item.addEventListener('mousedown', onMouseDown);
    item.addEventListener('dragstart', () => {
        return false;
    });
});


var form = $('form');
$('button').on('click', function() {
    form.submit();
});

form.on('submit', function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serializeArray();
    console.log(data);
    
    // $.post(url, data).done(function(res) {
    //     console.log(res);
    // }).fail(function(err) {
    //     console.log(err);
    // });
})