
$(document).ready(function() {
    if (window.avatarCreatorInitialized) return;
    window.avatarCreatorInitialized = true;

    const staticUrl = window.staticUrl || '/static/';
    
        const avatarParts = {
            skin: Array.from({length: 16}, (_, i) => `skin${i+1}.png`),
            eyebrow: Array.from({length: 16}, (_, i) => `eyebrow${i+1}.png`),
            eyes: Array.from({length: 4}, (_, i) => `eye${i+1}.png`),
            hair: Array.from({length: 55}, (_, i) => `hair${i+1}.png`),
            hat: Array.from({length: 16}, (_, i) => `hat${i+1}.png`),
            clothes: Array.from({length: 14}, (_, i) => `clothes${i+1}.png`),
            background: Array.from({length: 5}, (_, i) => `background${i+1}.png`),
        };

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');
        
        $('#addAvatarBtn').click(function() {
            $('#avatarModalLabel').text('Create New Avatar');
            $('#avatarForm')[0].reset();
            $('#avatarId').val('');
            Object.keys(avatarParts).forEach(part => {
                $(`#${part}`).val(avatarParts[part][0]);
                $(`#avatarPreview .avatar-part[src*="${part}"]`).attr('src', `${staticUrl}crudapp/assets/${part.charAt(0).toUpperCase() + part.slice(1)}/${avatarParts[part][0]}`);
            });
            $('#avatarPreview').css('background-image', `url('${staticUrl}crudapp/assets/Background/background1.png')`);
        });
        
        $(document).on('click', '.edit-btn', function() {
            const avatarId = $(this).data('id');
            const avatarCard = $('#avatar-' + avatarId);
            
            $('#avatarModalLabel').text('Edit Avatar');
            $('#avatarId').val(avatarId);
            $('#name').val(avatarCard.find('.card-title').text());
            
            const avatarContainer = avatarCard.find('.avatar-container');
            const bgImage = avatarContainer.css('background-image');
            const bgUrl = bgImage.replace('url("', '').replace('")', '');
            $('#background').val(bgUrl.substring(bgUrl.lastIndexOf('/') + 1));
            
            $('#avatarPreview').css('background-image', bgImage);
            
            ['skin', 'eyebrow', 'eyes', 'hair', 'hat', 'clothes'].forEach(part => {
                const partDir = part.charAt(0).toUpperCase() + part.slice(1);
                const imgSrc = avatarContainer.find(`img[src*="${partDir}"]`).attr('src');
                const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
                $(`#${part}`).val(fileName);
                $(`#avatarPreview .avatar-part[src*="${partDir}"]`).attr('src', imgSrc);
            });
        });
        
        $('#saveAvatarBtn').click(function() {
            const avatarId = $('#avatarId').val();
            const url = avatarId ? '/update/' + avatarId + '/' : '/create/';
            const method = avatarId ? 'POST' : 'POST';
            
            $.ajax({
                url: url,
                type: method,
                data: {
                    name: $('#name').val(),
                    skin: $('#skin').val(),
                    eyebrow: $('#eyebrow').val(),
                    eyes: $('#eyes').val(),
                    hair: $('#hair').val(),
                    hat: $('#hat').val(),
                    clothes: $('#clothes').val(),
                    background: $('#background').val(),
                    csrfmiddlewaretoken: csrftoken
                },
                success: function(response) {
                    if (response.status === 'success') {
                        if (avatarId) {
                            const avatarCard = $('#avatar-' + avatarId);
                            avatarCard.find('.card-title').text(response.name);
                            
                            const avatarContainer = avatarCard.find('.avatar-container');
                            avatarContainer.css('background-image', `url('${staticUrl}crudapp/assets/Background/${response.background}')`);
                            
                            ['skin', 'eyebrow', 'eyes', 'hair', 'hat', 'clothes'].forEach(part => {
                                const partDir = part.charAt(0).toUpperCase() + part.slice(1);
                                avatarContainer.find(`img[src*="${partDir}"]`).attr('src', `${staticUrl}crudapp/assets/${partDir}/${response[part]}`);
                            });
                        } else {
                            const displayName = response.name.trim() === '' ? ' ' : response.name;
                            
                            const newCard = `
                                <div class="col-md-3 col-sm-6 mb-4" id="avatar-${response.id}">
                                    <div class="avatar-card pixel-card">
                                        <div class="avatar-container pixel-bg" style="background-image: url('${staticUrl}crudapp/assets/Background/${response.background}')">
                                            <img src="${staticUrl}crudapp/assets/Skin/${response.skin}" class="avatar-part pixel-part">
                                            <img src="${staticUrl}crudapp/assets/Clothes/${response.clothes}" class="avatar-part pixel-part">
                                            <img src="${staticUrl}crudapp/assets/Eyes/${response.eyes}" class="avatar-part pixel-part">
                                            <img src="${staticUrl}crudapp/assets/Eyebrow/${response.eyebrow}" class="avatar-part pixel-part">
                                            <img src="${staticUrl}crudapp/assets/Hair/${response.hair}" class="avatar-part pixel-part">
                                            <img src="${staticUrl}crudapp/assets/Hat/${response.hat}" class="avatar-part pixel-part">
                                        </div>
                                        <div class="card-body pixel-card-body">
                                            <h5 class="card-title text-center pixel-text">${displayName}</h5>
                                            <div class="d-flex justify-content-center">
                                                <button class="btn btn-sm btn-warning edit-btn mx-1 pixel-btn-small" data-id="${response.id}" data-bs-toggle="modal" data-bs-target="#avatarModal">EDIT</button>
                                                <button class="btn btn-sm btn-danger delete-btn mx-1 pixel-btn-small" data-id="${response.id}">DELETE</button>
                                                <button class="btn btn-sm btn-success download-btn mx-1 pixel-btn-small" data-id="${response.id}">SAVE</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            $('#avatarsContainer').prepend(newCard);
                        }
                        
                        $('#avatarModal').modal('hide');
                    }
                }
            });
        });
       
$(document).off('click.deleteBtn').on('click.deleteBtn', '.delete-btn', function() {
    if (confirm('Are you sure you want to delete this avatar?')) {
        const avatarId = $(this).data('id');
        
        $.ajax({
            url: '/delete/' + avatarId + '/',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: csrftoken
            },
            success: function(response) {
                if (response.status === 'success') {
                    $('#avatar-' + avatarId).remove();
                }
            }
        });
    }
});

$(document).on('click', '.download-btn', function() {
    const avatarId = $(this).data('id');
    const avatarContainer = $('#avatar-' + avatarId).find('.avatar-container')[0];
    
    const computedStyle = window.getComputedStyle(avatarContainer);
    const width = parseInt(computedStyle.width);
    const height = parseInt(computedStyle.height);
    
    const options = {
        scale: 1, 
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        logging: false,
        useCORS: true,
        backgroundColor: null, 
        allowTaint: true, 
        imageTimeout: 0, 
        ignoreElements: (element) => {
            
            return element.classList.contains('btn-close') || 
                   element.classList.contains('modal-backdrop');
        }
    };
    
    const card = $(this).closest('.pixel-card');
    card.css('transform', 'translate(0, 0)');
    card.css('box-shadow', '6px 6px 0 #1d1d2f');
    
    html2canvas(avatarContainer, options).then(canvas => {
        card.css('transform', '');
        card.css('box-shadow', '');
        
        const link = document.createElement('a');
        link.download = `avatar-${avatarId}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(err => {
        console.error('Error generating image:', err);
        card.css('transform', '');
        card.css('box-shadow', '');
    });
});

        $(document).on('click', '.part-btn', function() {
            const part = $(this).data('part');
            showPartOptions(part);
        });
        
        function showPartOptions(part) {
            const optionsDisplay = $('#optionsDisplay');
            
            optionsDisplay.empty();
            
            avatarParts[part].forEach((file, index) => {
                const partDir = part.charAt(0).toUpperCase() + part.slice(1);
                const imgPath = `${staticUrl}crudapp/assets/${partDir}/${file}`;
                const isSelected = $(`#${part}`).val() === file;
                
                optionsDisplay.append(`
                    <div class="option-item ${isSelected ? 'selected' : ''}" data-part="${part}" data-file="${file}">
                        <img src="${imgPath}" alt="${part} option ${index + 1}">
                    </div>
                `);
            });
        }
        
        $(document).on('click', '.option-item', function() {
            const part = $(this).data('part');
            const file = $(this).data('file');
            const partDir = part.charAt(0).toUpperCase() + part.slice(1);
            
            if (part === 'background') {
                $('#avatarPreview').css('background-image', `url('${staticUrl}crudapp/assets/Background/${file}')`);
            } else {
                $(`#avatarPreview .avatar-part[src*="${partDir}"]`).attr('src', `${staticUrl}crudapp/assets/${partDir}/${file}`);
            }
            
            $(`#${part}`).val(file);
            
            $(this).addClass('selected').siblings().removeClass('selected');
        });
});