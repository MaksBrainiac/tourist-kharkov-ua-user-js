// ==UserScript==
// @name        Kharkov Tourist Bike Events Decorator
// @version     1.4
// @author      MaksBrainiac
// @include     *://tourist.kharkov.ua/*
// @include     *://xt.ht/*
// @grant       none
// @downloadURL https://github.com/MaksBrainiac/tourist-kharkov-ua-user-js/raw/master/tourist.kharkov.ua.user.js
// ==/UserScript==

(function(){

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

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function updateTouristList()
{
    var friends = localStorage.getItem("KTDEC-friends");
    if (!friends)
        friends = [];
    else
        friends = friends.split("\n");

    if (window.location.hash.indexOf("goforum") > 0)
    {
        window.location.href = $('form[action="cycleplan_do_register.php"] a').last().attr('href');
        return;
    }

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

    if (window.location.href.indexOf("cycleplan_index") > 0)
    {
        var mVal = $('#wrapcentre table').eq(0).find('select[name="m"]').val();
        var yVal = $('#wrapcentre table').eq(0).find('input[name="y"]').val();
        var ymDate = new Date(yVal, mVal-1, 1, 0, 0, 0);

        $('#wrapcentre table').eq(1).find('tr').each(function(index){
            var d = $(this).find('td').eq(0).text();
            var $$td = $(this).find('td').eq(2);
            var $$tda = $(this).find('td').eq(4);
            var completed = $(this).find('td').eq(5).text() == "Завершена";
            if (completed)
            {
                $(this).css('color', '#555555');
                $(this).find('td a').css('color', '#555555');
                $(this).find('td a').css('font-weight', 'normal');
            }

            if ($$td.text().indexOf('[Вело]') > -1)
            {
                if (!completed)
                {
                    $$td.find('a').css('color', '#553311');
                    $$tda.find('a').css('color', '#553311');
                }
                $$td.css('font-weight', 'bold');
                $$tda.css('font-weight', 'bold');
            }

            if (friends.indexOf($$tda.text()) >= 0)
            {
                $$tda.css('font-size', '16px');
                $$td.css('font-size', '14px');
            }

            if (d != "")
            {
                ymDate.setDate(d);
                var wD = ymDate.getDay();
                if (wD == 0 || wD == 6)
                {
                    $(this).css('background-color', '#FCF8E3');
                }
            }
        });
    }

    addGlobalStyle(
        '.bikeCal { background: white; border-collapse: collapse; table-layout: fixed; box-shadow: 0 0 5px rgba(0,0,0,0.5); } \n' + 
        '.bikeCal td { font-size: 10px; margin: 0; padding: 1px; background: #FCF8E3; width: 210px; border: 1px solid #777777; vertical-align: top; } \n' +
        '.bikeCal td { white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; overflow: hidden; overflow-y: hidden; } \n' +
        '.bikeCal td div.z { height: 140px; overflow: hidden; } \n' +
        '.bikeCal td div.num { font-weight: bold; font-size: 12px; color: #553311; } \n' +
        '.bikeCal td.old { background: #FFEECC } \n' +
        '.abs { text-align: center; width: 100%; position: absolute; z-index: 100; padding-top: 250px; } \n' +
        '.abr { text-align: left; position: relative; display: inline-block; margin: 0 auto; } \n' +
        '.fo  { text-align: left; position: relative; display: inline-block; margin: 0 auto; padding: 5px 10px; background: #FFEECC; box-shadow: 0 0 5px rgba(0,0,0,0.5); } \n' +
        '.cls { position: absolute; text-decoration: none; right: -8px; top: -8px; font-weight: bold; font-size: 20px; color: white !important; text-shadow: -1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; } \n' +
        '.rLink { position: absolute; left: 0; top: 6px; font-weight: bold; } \n' +
        '.links { text-align: center; padding-top: 5px; font-weight: bold; } \n' +
        '.fo { position: relative; } \n' +
        '.fo textarea { width: 250px; } \n' +
        '.decorated { font-weight: bold; #553311 } \n' +
        '.loading { font-size: 36px; color: white; text-shadow: 2px 2px 10px rgba(0, 0, 0, 1); } \n' +
        ''
    );

    if (window.location.href.indexOf("/phpbb/") > 0)
    {
        var loadCalendarData = function(y, m, next){
            $.ajax({
                type: "GET",
                url: "/phpbb/cycleplan_index.php?m=" + m + "&y="+ y + "&type=10&dont_show_commerce=1",
                dataType: "text",
                success: function(msg){
                    var f1 = '<div id="wrapcentre">';
                    var k0 = msg.indexOf(f1);
                    if (k0 > 0)
                    {
                        msg = msg.substr(k0 + f1.length);

                        var fx = '<table';
                        var kx = msg.indexOf(fx);

                        msg = msg.substr(kx + fx.length);
                        kx = msg.indexOf(fx);
                        msg = msg.substr(kx + fx.length);

                        fx = '</table>';
                        kx = msg.indexOf(fx);
                        msg = msg.substr(0, kx);

                        var lines = msg.split('<tr>');
                        var events = [];

                        for (var i = 2; i < lines.length; i++)
                        {
                            var lparts = lines[i].split('<td>');
                            var lday = lparts[1].substr(0, lparts[1].length - 5);
                            var ltime = lparts[2].substr(0, lparts[2].length - 5);
                            var lname = lparts[3].substr(0, lparts[3].length - 5);
                            var lcount = lparts[4].substr(0, lparts[4].length - 5);
                            var lorg = lparts[5].substr(0, lparts[5].length - 5);

                            var kz = lorg.indexOf(">");
                            lorg = lorg.substr(kz+1, lorg.length - kz - 1 - 4);

                            if (lday != "")
                            {
                                events.push({
                                    y: +y,
                                    m: +m,
                                    d: +lday,
                                    time: ltime,
                                    name: lname,
                                    org: lorg,
                                    people: lcount
                                });
                            }
                        }

                        next(events);
                    }
                }
            });
        };

        //var $menu = $('td.genmed').eq(1);
        //$menu.prepend($('<span> |  </span>'));
        //$menu.prepend($('<a href="#" id="bikeCal">Вело!</a>'));

        var $menuLinks = $('#menubar .genmed').eq(0);
        $menuLinks.append("&nbsp; &nbsp;");
        $menuLinks.append($('<a class="decorated" href="#" id="bikeCal">Велокалендарь!</a>'));
        $menuLinks.append("&nbsp; &nbsp;");
        $menuLinks.append($('<a class="decorated" href="#" id="friendsBtn">Друзья (' + friends.length + ')</a>'));
        
        /*var $$td = $('.search-box').closest('tr').find('.gensmall');
        $$td.css('position', 'relative');
        $r = $('<div></div>');
        $r.addClass('rLink');
        $r.append($('<a href="#" id="bikeCal">Велокалендарь!</a>'));
        $r.append(" ");
        $r.append($('<a href="#" id="friendsBtn">Друзья (' + friends.length + ')</a>'));
        $$td.prepend($r);*/

        var zDiv;
        if ($('.abs').length > 0)
        {
            zDiv = $('.abs');
        }
        else
        {
            zDiv = $('<div></div>');
            zDiv.addClass('abs');
            $('body').prepend(zDiv);
        }
        zDiv.hide();

        $('#friendsBtn').click(function(e){
            e.preventDefault();
            zDiv.empty();
            zDiv.show();
            ///zDiv.html('<div class="loading">Loading…</div>');
            zDiv.html('<div class="fo"><a class="cls" href="#">X</a><textarea rows="20" id="textFriends"></textarea><br/><div class="links"><a id="loadprof" href="#">Из профайла</a>&nbsp;&nbsp;&nbsp;<a id="savefr" href="#">Сохранить</a></div></div>');
            
            if ($('a[href="./ucp.php?mode=register"]').length > 0)
                $('#loadprof').hide();
            
            $('.cls').click(function(ev){
                 ev.preventDefault();
                 zDiv.empty();
                 zDiv.hide();
            });
            
            $("#textFriends").val(friends.join("\n"));
            $("#savefr").click(function(ev){
                ev.preventDefault();
                var ffList = $('#textFriends').val().split("\n");
                localStorage.setItem("KTDEC-friends", ffList.join("\n"));
                zDiv.empty();
                zDiv.hide();
                window.location.href = window.location.href;
            });    
            $("#loadprof").click(function(ev){
                ev.preventDefault();
                $.ajax({
                    type: "GET",
                    url: "/phpbb/ucp.php",
                    dataType: "text",
                    success: function(msg){
                        var find = "<th>Друзья</th>";
                        var k0 = msg.indexOf(find);
                        if (k0)
                        {
                            msg = msg.substr(k0);
                            k0 = msg.indexOf('src="images/spacer.gif"');
                            msg = msg.substr(0, k0);
                            
                            var fList = [];
                            while (true) {
                                k0 = msg.indexOf('<li><a href');
                                if (k0 < 0) break;
                                
                                msg = msg.substr(k0 + 9);
                                msg = msg.substr(msg.indexOf(">") + 1);
                                var na = msg.substr(0, msg.indexOf("</a>"));
                                fList.push(na);
                            }
                                
                            var ffList = $('#textFriends').val().split("\n");
                            for (var i = 0; i < fList.length; i++)
                            {
                                if (ffList.indexOf(fList[i]) < 0)
                                    ffList.push(fList[i]);
                            }
                            
                            $('#textFriends').val(ffList.join("\n"));
                        }
                    }
                });
            });
        });
            
        $('#bikeCal').click(function(e){
            e.preventDefault();
            zDiv.empty();
            zDiv.show();
            zDiv.html('<div class="loading">Loading…</div>');
            
            var dNow = new Date();
            var day = dNow.getDay();
            var dMon = new Date(dNow);
            dMon.setDate(dMon.getDate() - day + (day == 0 ? -6:1) - 7);
            dPlus2W = new Date(dMon);
            dPlus2W.setDate(dPlus2W.getDate() + 13);

            ///dPlus2W = new Date(2015, 08, 1);
            ///console.log(dPlus2W);

            var dStart = new Date(dMon);

            var readyFunc = function(events){

                var ls = 3;
                var $table = $('<table class="bikeCal"></table>');
                //$table.css('position', 'absolute');
                var kmin = 0;
                var oldX = true;
                var mon = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

                for (var i = 0; i < ls; i++)
                {
                    var $line = $('<tr></tr>');
                    $table.append($line);

                    for (var j = 0; j < 7; j++)
                    {
                        var $td = $('<td></td>');
                        $line.append($td);

                        if (dNow.getFullYear() == dStart.getFullYear() && dNow.getMonth() == dStart.getMonth() && dNow.getDate() == dStart.getDate())
                            oldX = false;

                        if (oldX)
                            $td.addClass('old');
                        var $div = $('<div></div>');
                        $div.addClass('z');
                        $td.append($div);

                        var $num = $('<div></div>');
                        $num.addClass('num');
                        $num.text(dStart.getDate() + (dNow.getMonth() != dStart.getMonth() ? " " + mon[dStart.getMonth()] : ""));
                        $div.append($num);

                        for (var k = kmin; k < events.length; k++)
                        {
                            if (events[k].y == dStart.getFullYear() && (events[k].m == dStart.getMonth() + 1) && events[k].d == dStart.getDate())
                            {
                                var isFriend = friends.indexOf(events[k].org) >= 0;
                                var $spanx = $('<span></span>');
                                $spanx.attr('title', events[k].org + (events[k].people > 1 ? (" (+" + (events[k].people-1) + ")") : ""));
                                $spanx.append("<b>" + events[k].time + "</b> " + (isFriend ? "<b>" : "") + events[k].name + (isFriend ? "</b>" : ""));
                                $div.append($spanx);
                                $div.append("<br />");
                                kmin = k + 1;
                            }
                        }

                        dStart.setDate(dStart.getDate() + 1);
                    }
                }

                ///$place.prepend($table);

                var xDiv = $('<div></div>');
                var $cButton = $('<a class="cls" href="#">X</a>');

                $cButton.click(function(ev){
                    ev.preventDefault();
                    zDiv.empty();
                    zDiv.hide();
                });

                zDiv.empty();
                zDiv.show();
                xDiv.addClass('abr');
                zDiv.append(xDiv);
                xDiv.append($cButton);
                xDiv.append($table);

                $table.find('a').each(function(index){
                    $(this).attr('href', $(this).attr('href') + '#goforum');
                });
                ///console.log(events);
            };

            var nextFunc = readyFunc;
            if (dPlus2W.getMonth() != dMon.getMonth())
            {
                nextFunc = function(events){
                    loadCalendarData(dPlus2W.getFullYear(), dPlus2W.getMonth() + 1, function(elist){
                        readyFunc(events.concat(elist));
                    });
                }
            }
            loadCalendarData(dMon.getFullYear(), dMon.getMonth() + 1, nextFunc);
        });
    }
}

codeEval(addGlobalStyle);
functionEval(updateTouristList);
//window.addEventListener('load', function(){ functionEval(updateTouristList); }, true);
    
})();
