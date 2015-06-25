// ==UserScript==
// @name        Kharkov Tourist Bike Events Decorator
// @version     1.2
// @author      MaksBrainiac MakismusXP@gmail.com
// @include     http://tourist.kharkov.ua/*
// @grant none
// ==/UserScript==

// helper function to run code in the target, or add functions
function codeEval(source) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;

    document.body.appendChild(script);
    document.body.removeChild(script);
}

// helper function to run function bodies in the target
function functionEval(source) {
    source = '(' + source + ')();';
    codeEval(source);
}

function updateTouristList()
{
    var friends = [
        '____________________________'
    ];

    //
    $('#Layers a').each(function(index){
        if ($(this).text().indexOf('[Вело]') > -1)
        {
            $(this).css('color', '#553311');
            $(this).css('font-weight', 'bold');
            //$(this).css('color', 'blue');
        }
    });

    $('.topicauthor a, a.postlink, .postauthor a, a.postlink-local').each(function(index){

        if (friends.indexOf($(this).text()) >= 0)
        {
            if ($(this).closest('tr'))
            {
                $($(this).closest('tr').find('td')[1]).find('a').css('text-decoration', 'underline');
                $($(this).closest('tr').find('td')[1]).find('a').css('font-size', '16px');
                $($(this).closest('tr').find('td')[1]).find('a').css('font-weight', 'bold');
                //$($(this).closest('tr').find('td')[1]).find('a').css('color', '#004000');
            }
            //$(this).css('color', '#004000');
            $(this).css('color', '#553311');
            $(this).css('font-size', '14px');
            $(this).css('font-weight', 'bold');
            $(this).css('text-decoration', 'underline');
        }
    });

    $('a.topictitle').each(function(index){
        if ($(this).text().indexOf('[Вело]') > -1)
        {
            $(this).css('color', '#553311');
            $($(this).closest('tr').find('td')[1]).find('a').css('color', '#553311');
            $(this).closest('tr').find('td.row1').css('background-color', '#FCF8E3');

            if (document.location.href.indexOf('viewforum') > -1)
            {
                var img = $($(this).closest('tr').find('td')[0]).find('img');
                if (img.attr('src').indexOf('topic_unread') > 0 && img.attr('src').indexOf('locked') < 0)
                {
                    img.attr('src', 'https://lh4.googleusercontent.com/-RHmit0x1zGU/UyCrIDoDhHI/AAAAAAAAEOI/oVlsjIW10rU/s24/bik24.png');
                    img.removeAttr('width').removeAttr('height');
                }
                else if (img.attr('src').indexOf('topic_read') > 0 && img.attr('src').indexOf('locked') < 0)
                {
                    img.attr('src', 'https://lh4.googleusercontent.com/-j52l6XovG28/UyCrIVtqyJI/AAAAAAAAEOM/Z1BWPCMXtkE/s24/bik24gr.png');
                    img.removeAttr('width').removeAttr('height');
                }

                //var p = $(this).parent();
                //p.prepend($('<img src="" alt="" />').attr('src', "http://lh4.ggpht.com/_kANtLRVrVbQ/TL6oc1oqE_I/AAAAAAAAAt4/Z0gB_R9744k/bicycle-icon.png"));
            }
        }
    });

    $('a[href="http://1/"]').each(function(index) {
        $(this).attr('href', 'http://tourist.kharkov.ua/phpbb/memberlist.php?username=' + encodeURIComponent($(this).text()));
        $(this).after($('<a style="color: black; font-weight: bold; margin-left: 4px;"></a>').text('©' /* + $(this).text()*/ + '').attr('href', 'http://' + encodeURIComponent($(this).text()) + '.tourist.kharkov.ua'));
    });
}

//codeEval(getRLink);
window.addEventListener('load', function(){ functionEval(updateTouristList); }, true);
