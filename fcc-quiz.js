var sectionDir = 'FreeCodeCamp/seed/challenges/01-front-end-development-certification/'
var sections = ["advanced-bonfires.json","advanced-ziplines.json","basic-bonfires.json","basic-javascript.json","basic-ziplines.json","bootstrap.json","front-end-development-certificate.json","gear-up-for-success.json","html5-and-css.json","intermediate-bonfires.json","intermediate-ziplines.json","jquery.json","json-apis-and-ajax.json","object-oriented-and-functional-programming.json"]

fetch(sectionDir + "basic-javascript.json").then(function(resp) {
    resp.json().then( function(json) {
        window.json = json
        for (var i=0; i<json.challenges.length; i++) {
            renderChallenge(json.challenges[i])
            seed_map[json.challenges[i].id] = json.challenges[i]
        }
    })
})

var seed_map = {}


function renderChallenge(challenge) {
    var content = document.querySelector("#content")
    var t = document.querySelector("#challenge-template")
    var clone = document.importNode(t.content, true)
    clone.querySelector('.challenge-container').id = 'challenge-' + challenge.id
    clone.querySelector('.title').textContent = challenge.title
    var descDiv = clone.querySelector('.description')
    for (var i=0; i<challenge.description.length; i++) {
        var text = challenge.description[i]
        var p = document.createElement('p')
        p.innerHTML = text
        descDiv.appendChild(p)
    }
    clone.querySelector('.title').textContent = challenge.title
    clone.querySelector('.input-area textarea').textContent = challenge.challengeSeed.join('\n')
    clone.querySelector('input[type="button"]').addEventListener('click', function(e) {
        var challengeDiv = document.querySelector('#challenge-'+challenge.id)
        var text = challengeDiv.querySelector('.input-area textarea').textContent
        runTestIframe(challenge.id)
    })
    content.appendChild(clone)
}

function runTestIframe(id) {
    var challengeDiv = document.querySelector('#challenge-'+id)
    var challenge = seed_map[id]
    var text = challengeDiv.querySelector('textarea').value

    var iframe = document.createElement('iframe')
    iframe.src = 'testframe.html'
    iframe.style.display='none'
    challengeDiv.querySelector('.test-iframe').innerHTML = ''
    challengeDiv.querySelector('.test-iframe').appendChild(iframe)
    iframe.contentWindow.addEventListener('message', function(e) {
        if (e.data.loaded) {
            iframe.contentWindow.postMessage({command:'runTest',text:text,challenge:challenge},'*')
        } else {
            if (e.data.command) { return }
            console.log('iframe returns message',e.data)
            var result = e.data.result
            if (result) {
                challengeDiv.querySelector('.test-result').innerHTML = result.message
            } else {
                challengeDiv.querySelector('.test-result').textContent = 'passed!'
            }
        }
    }, false)
}
