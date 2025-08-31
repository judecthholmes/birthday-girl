document.addEventListener('DOMContentLoaded', () => {
    // Album modal logic
    const mainContainer = document.querySelector('.y2k-container');
    const albums = {
        // To add more images, upload them to the images/ folder and add their filenames below
        // Set a message for each image in the messages array (same order as images)
        'gagliari': {
            title: 'Gagliari',
            images: [
                'images/cagliari1.jpg',
                'images/cagliari2.jpg',
                'images/cagliari3.jpg',
                'images/cagliari4.jpg',
            ],
            messages: [
                "AURAAA. literally your aura permeating through this picture. so heavenly, calm and bright! just like your future my diva :')",
                '2 MOMS AND THEIR CHILD. this was so cute and i was in AWE at your skills crafting this genius O_O',
                "this restaurant was so nice i can't even begin to tell you! thank you for being so patient and sitting through 3 courses of vegan food whilst i was practically in heaven.",
                "blub blub. This trip was so much fun! i am so happy that we were able to do this. i feel like i fulfilled my life wish of playing mermaids with you. the thrift/conseignment store shopping was like a dream come true for me. i absolutely loved exploring the city with you and just being with you. i love you my shayla <3"
            ]
        },
        'tokyoo': {
            title: 'Tokyoo >0<',
            images: [
                'images/tokyo1.jpg',
                'images/tokyo2.jpg',
                'images/tokyo3.jpg',
                'images/tokyo4.jpg',
                'images/tokyo5.jpg',
                'images/tokyo6.jpg',
                'images/tokyo7.jpg',
                'images/tokyo8.jpg',
                'images/tokyo9.jpg',
                'images/tokyo10.jpg',
                'images/tokyo11.jpg',
                'images/tokyo12.jpg',
                'images/tokyo13.jpg',
                'images/tokyo14.jpg',
                'images/tokyo15.jpg',
                'images/tokyo16.jpg',
            ],
            messages: [
                'the second i touched down we had "shayla!!!" rapunzel moment, then immediately headed to this body-built-right DIVAAA for the ultimate mug-off of the century (we won)',
                'i love this picture so much i tried to set it to my laptop lock screen but couldn\'t figure out how. i think you look so beautiful >0<',
                'outside the pancake place. give a girl some damn pancakes! but on a real note, this was when i really felt like i was in tokyo and i was just in AWE.',
                'this accidental diva serve hair flip in brandy (if you\'re God, brandy is heaven)',
                'TEAM LABS!!! >0< this was the most insane amount of fun i love how much you let loose completely and didnt gaf about the damn rules and just kept bounce bouncing after we got told not to 😭😭',
                'i love these pictures i\'m so glad we took the time to take them <3',
                'i dont know if you remember but this was to assure my mom that we were ok & safe 😭',
                'THIS ROOFTOP WAS SO MAGICAL. I remember thinking "wow i feel so connected to life right now". and I am so thankful you took us to that restaurant in your hotel. it was so beautiful and especially the waiter who i think was australian? it was so nice to have an english speaker girlie to chit chat with',
                'THE KOI FISH?? so magical.',
                'SANRIO PUROLANDDDD!!!! "do you think they\'ll play hot to go?" "girl this is the sanrio puroland musical"',
                'ohh now this serve... unliiimitteedddd',
                '"me and my girl pulling up if anyone ever act up on either of us"',
                'you might not remember but this was THE ICONIC "MONA LISA SMILE" synchronised moment!!! ',
                'you are such a genius for these photo booths.',
                'PETER PAN RIDE AT DISNEY SEA TOKYO',
                'but seriously: Tokyo was such an insanely magical time. The entire trip felt so much longer than it was and it was because I was having the TIME of my life every single day. It was such an ethereal experience to get to share in that time with you and I\'m so honoured that you wanted to spend time with me, it was truly ethereal and I will never forget this and I will never stop thinking so fondly of the trip, and you. I hope we can make it happen again - soon! :D <3'
            ]
        },
        'lilledon': {
            title: 'Lilledon',
            images: [
                'images/lilledon.jpeg',
                'images/londonille1.jpg',
                'images/londonille2.jpg',
                'images/londonille3.jpg',
                'images/londonille4.jpg',
                'images/londonille5.jpg',
                'images/londonille6.jpg',
                'images/londonille7.jpg',
                'images/londonille8.jpg',
                'images/londonille9.jpg',
                'images/londonille10.jpg',
                'images/londonille11.jpg',
            ],
            messages: [
                'Your custom message for lilledon.jpeg',
                'getting the eurostar was soo fun. do you remember sitting opposite that crazy dude? and i will always think about how you commented on my confidence when those people said we were in their seats... so many lovely memories. i loved meeting you in the joe and the juice, and consequently getting to meet ms TUBBY suitcase for the first time',
                'your iconic loaf. may it live on forever.',
                'THE diva pic (that we all actually like LOL)',
                'ms. super mario up in here !!! the town was so beautiful, i remember walking through it and we kept saying "woah it doesn\'t even feel like we\'re together right now?!"',
                'it rained so hard on this damn ferris wheel 😭',
                'ohh this diva SERVE. the only diva to ever do it this hard. miss kate sloane.',
                'all the divas on the DIGI, HELLO!!!',
                'oh is she asleep?',
                'SURPRISE. she was just gearing up for the ultimate serve-tron.',
                'girl what is my mouth doing? 😭',
                'i love your digi and i loved receiving all the content after the trip >0<'
            ]
        }
    };

    const albumCovers = document.querySelectorAll('.album-cover');
    const albumModal = document.getElementById('album-modal');
    const albumTitle = document.getElementById('album-title');
    const albumImage = document.getElementById('album-image');
    const albumPrev = document.getElementById('album-prev');
    const albumNext = document.getElementById('album-next');
    const albumImageText = document.getElementById('album-image-text');
    const albumModalClose = document.getElementById('album-modal-close');

    let currentAlbum = null;
    let currentImageIndex = 0;

    albumCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            const albumKey = cover.getAttribute('data-album');
            openAlbumModal(albumKey);
        });
    });

    function openAlbumModal(albumKey) {
    currentAlbum = albumKey;
    currentImageIndex = 0;
    updateAlbumModal();
    albumModal.style.display = 'flex';
    if (mainContainer) mainContainer.classList.add('blurred');
    }

    function updateAlbumModal() {
    const album = albums[currentAlbum];
    albumTitle.textContent = album.title;
    albumImage.src = album.images[currentImageIndex];
    const albumImageMessage = document.getElementById('album-image-message');
    albumImageMessage.textContent = album.messages[currentImageIndex] || '';
    }

    albumPrev.addEventListener('click', () => {
        if (!currentAlbum) return;
        const album = albums[currentAlbum];
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateAlbumModal();
        }
    });

    albumNext.addEventListener('click', () => {
        if (!currentAlbum) return;
        const album = albums[currentAlbum];
        if (currentImageIndex < album.images.length - 1) {
            currentImageIndex++;
            updateAlbumModal();
        }
    });


    albumModalClose.addEventListener('click', () => {
    albumModal.style.display = 'none';
    if (mainContainer) mainContainer.classList.remove('blurred');
    currentAlbum = null;
    currentImageIndex = 0;
    });
}); 