document.addEventListener('DOMContentLoaded', function () {
    fullscreenPlayer('.plyrBtn')
})


function fullscreenPlayer(btnsSelector) {
    var plyrWrapper = null
    var plyrElement = null
    var plyr = null
    var closeBtn = null
    var lastID = ''
    var readyFlag = false
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    var plyrBtns = document.querySelectorAll(btnsSelector)

    if (!plyrBtns.length) { return }

    for (var i = 0; i < plyrBtns.length; i++) {
        if (i === 0) {
            plyrWrapper = document.createElement('div')
            plyrWrapper.style.position = 'fixed'
            plyrWrapper.style.zIndex = 99999
            plyrWrapper.style.width = '300px'
            plyrWrapper.style.top = '-200%'
            plyrWrapper.style.left = '-200%'

            plyrElement = document.createElement('div')
            plyrElement.setAttribute('data-plyr-provider', 'youtube')
            plyrElement.setAttribute('data-plyr-embed-id', getYoutubeURL(plyrBtns[i].getAttribute('data-youtube-id')))

            closeBtn = document.createElement('div')
            closeBtn.className = 'plyr-close-btn'
            isMobile && closeBtn.classList.add('is-mobile')
            closeBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M18 6L6 18"/>
                </svg>
            `

            plyrWrapper.appendChild(plyrElement)
            document.body.appendChild(plyrWrapper)

            plyr = new Plyr(plyrElement)

            plyrWrapper.querySelector('.plyr').appendChild(closeBtn)

            closeBtn.addEventListener('click', function () {
                plyr.fullscreen.exit()
            })
        }

        plyrBtns[i].addEventListener('click', function () {
            var vid = this.getAttribute('data-youtube-id')

            if (!vid || vid.length < 3) {
                console.log('Нужен аттрибут "data-youtube-id" на кнопке')
                return
            }

            if (lastID === vid) {
                plyr.fullscreen.enter()
                lastID = vid
            } else {
                plyr.source = {
                    type: 'video',
                    sources: [
                        {
                            src: getYoutubeURL(vid),
                            provider: 'youtube',
                        },
                    ],
                }

                lastID = vid
            }

        })
    }

    plyr.on('ready', function () {
        if (!readyFlag) {
            readyFlag = true
        } else {
            plyr.fullscreen.enter()
        }
    })

    plyr.on('enterfullscreen', function () {
        closeBtn.classList.add('is-show')
        plyr.volume = 0.2
        plyr.play()
    })

    plyr.on('exitfullscreen', function () {
        closeBtn.classList.remove('is-show')
        plyr.pause()
    })
}

function getYoutubeURL(ID) {
    return 'https://www.youtube.com/embed/' + ID + '?origin=' + document.location.protocol + '//' + document.location.host + '&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'
}
