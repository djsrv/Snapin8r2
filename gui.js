var output = document.getElementById('output');
var sb2 = document.getElementById('sb2');
sb2.addEventListener('change', onFileInput);

function onFileInput() {
    output.classList.remove('success');
    output.classList.remove('error');
    output.classList.remove('warnings');
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
    output.textContent = 'Converting...';

    var file = this.files[0];
    var reader = new FileReader();
    var projectName = file.name.replace(/\.(sb2|sbx|zip)$/, '');
    reader.addEventListener('load', function(e) {
        Snapin8r(e.target.result, projectName, onConversion);
    });
    reader.readAsArrayBuffer(file);

    function onConversion(err, result, warnings) {
        console.log(err, result, warnings);

        var output = document.getElementById('output');
        var el, li, msg;

        while (output.firstChild) {
            output.removeChild(output.firstChild);
        }
        if (err) {
            output.classList.add('error');

            el = document.createElement('span');
            el.textContent = 'Unfortunately, conversion failed. The reason is:';
            output.appendChild(el);

            el = document.createElement('code');
            el.textContent = err;
            output.appendChild(el);

            el = document.createElement('span');
            el.innerHTML = 'This is likely a bug. Please report this <a href="https://github.com/djdolphin/Snapin8r2/issues">here</a>.';
            output.appendChild(el);
        } else {
            el = document.createElement('span');
            el.textContent = 'It worked!';
            output.appendChild(el);

            el = document.createElement('a');
            el.href = "http://snap.berkeley.edu/snapsource/snap.html#open:" + encodeURIComponent(result);
            el.target = '_top';
            el.textContent = 'Click here to open your project.';
            output.appendChild(el);

            el = document.createElement('a');
            el.href = URL.createObjectURL(new Blob([result], {type: 'text/xml'}));
            el.download = projectName + '.xml';
            el.textContent = 'Click here to download your project.';
            output.appendChild(el);

            if (warnings) {
                output.classList.add('warnings');

                el = document.createElement('span');
                el.textContent = 'However, there were some warnings:';
                output.appendChild(el);

                el = document.createElement('ul');
                for (var i = 0, l = warnings.length; i < l; i++) {
                    li = document.createElement('li');
                    msg = document.createElement('code');
                    msg.textContent = warnings[i];
                    li.appendChild(msg);
                    el.appendChild(li);
                }
                output.appendChild(el);

                el = document.createElement('span');
                el.textContent = 'These features were skipped during conversion.';
                output.appendChild(el);
            } else {
                output.classList.add('success');
            }
        }
    }
}
