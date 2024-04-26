$(document).ready(function() {
    // Set default headers for AJAX requests
    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Function to handle submission of license information
    window.submitLicenseInfo = function () {
        let licenseInfo = {
            licenseeName: $('#licenseeName').val(),
            assigneeName: $('#assigneeName').val(),
            expiryDate: $('#expiryDate').val()
        };
        localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));
        $('#mask, #form').hide();
    };

    // Function to handle search input
    $('#search').on('input', function(e) {
        $("#product-list").load('/search?search=' + e.target.value);
    });

    // Function to show license form
    window.showLicenseForm = function () {
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        $('#licenseeName').val(licenseInfo?.licenseeName || '光云');
        $('#assigneeName').val(licenseInfo?.assigneeName || '藏柏');
        $('#expiryDate').val(licenseInfo?.expiryDate || '2111-11-11');
        $('#mask, #form').show();
    };

    // Function to show VM options
    window.showVmoptins = function () {
        let t="-javaagent:/(Your Path)/ja-netfilter/ja-netfilter.jar\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED";
        let y=t+"\n\n"+"\"The above text has been copied to the clipboard.\"";
        alert(y);

        // 如果当前浏览器版本不兼容navigator.clipboard
        if (!navigator.clipboard) {
            var ele = document.createElement("input");
            ele.value = t;
            document.body.appendChild(ele);
            ele.select();
            document.execCommand("copy");
            document.body.removeChild(ele);
            if (document.execCommand("copy")) {
                console.log("复制成功！");
            } else {
                console.log("复制失败！");
            }
        } else {
            navigator.clipboard.writeText(t).then(function () {
                console.log("复制成功！");
            }).catch(function () {
                console.log("复制失败！");
            })
        }
    };

    // Function to copy license
    window.copyLicense = async function (e) {
        while (localStorage.getItem('licenseInfo') === null) {
            $('#mask, #form').show();
            await new Promise(r => setTimeout(r, 1000));
        }
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        let productCode = $(e).closest('.card').data('productCodes');
        let data = {
            "licenseName": licenseInfo.licenseeName,
            "assigneeName": licenseInfo.assigneeName,
            "expiryDate": licenseInfo.expiryDate,
            "productCode": productCode,
        };
        $.post('/generateLicense', JSON.stringify(data))
            .then(response => {
                copyText(response)
                    .then((result) => {
                        alert(result);
                    });
            });
    };

// Function to copy text to clipboard
    const copyText = async (val) => {
        if (navigator.clipboard && navigator.permissions) {
            await navigator.clipboard.writeText(val);
            return "The activation code has been copied";
        } else {
            console.log(val);
            return "The system does not support it, please go to the console to copy it manually";
        }
    };

});
