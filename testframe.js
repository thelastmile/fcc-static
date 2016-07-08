jQuery.noConflict()
window.assert = chai.assert

window.addEventListener('message', function(e) {
    if (e.data.challenge) {
        var result = runTest(e.data.text, e.data.challenge)
        window.postMessage({result:result},'*')
    }
}, false)
window.postMessage({loaded:true},'*')


function runTest(text, challenge) {
    var debugErrors = false /* only if webkit inspector open, maybe */
    window.$ = function(sel) {
        var testDiv = document.createElement('div')
        testDiv.innerHTML = text
        return jQuery(sel, testDiv)
    }
    window.code = text
    if (challenge.head) {
        eval(challenge.head.join('\n'))
    }
    try {
        eval(text)
    } catch(e) {
        console.error('syntax error?',e)
        return {name:e.name,
                message:e.name + ': ' + e.message,
                stack:e.stack}
    }
    if (challenge.tail) {
        eval(challenge.tail.join('\n'))
    }

    for (var i=0; i<challenge.tests.length; i++) {
        if ( debugErrors ) {
            eval(challenge.tests[i])
        }
        try {
            eval(challenge.tests[i])
            console.log('a test passes!')
        } catch(e) {
            console.error('test failed',challenge.title,e)
            return e
        }
    }
}
