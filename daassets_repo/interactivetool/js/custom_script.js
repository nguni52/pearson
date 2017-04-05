// added by Nguni
var globalURI = window.location.protocol + "//" + window.location.host + "" + window.location.pathname;
globalURI = globalURI.substring(0, globalURI.indexOf("")) + "/da";
var quizName;

function Qtiptooltip() {

    //Qtip

//$('[title]').qtip(); // Grab all elements with a title attribute, and apply qTip!
    $('[title!=""]').qtip({
            position: {
                my: 'Top Center',  // Position my top left...
                at: 'Bottom Center'


            },
            style: {
                classes: 'qtip-bootstrap',

            }
        }
    ); // A bit better. Grab elements with a title attribute that isn't blank.

//$('[title]').qtip(); // Grab all elements with a title attribute, and apply qTip!
    $('[oldtitle]').qtip({
            position: {
                my: 'Top Center',  // Position my top left...
                at: 'Bottom Center'


            },
            style: {
                classes: 'qtip-bootstrap',

            }
        }
    ); // A bit better. Grab elements with a title attribute that isn't blank.


//$('[title]').qtip(); // Grab all elements with a title attribute, and apply qTip!
    $('.q-review-btn').qtip({
            position: {
                my: 'Left Center',  // Position my top left...
                at: 'Right Center'


            },
            style: {
                classes: 'qtip-bootstrap',

            }
        }
    ); // A bit better. Grab elements with a title attribute that isn't blank.


//$('[title]').qtip(); // Grab all elements with a title attribute, and apply qTip!
    $('.q-details-btn').qtip({
            position: {
                my: 'Right Center',  // Position my top left...
                at: 'Left Center'


            },
            style: {
                classes: 'qtip-bootstrap',

            }
        }
    ); // A bit better. Grab elements with a title attribute that isn't blank.

    $(".q-details-btn").click(function () {
        $(this).qtip('hide');
    });

    $(".q-review-btn").click(function () {
        $(this).qtip('hide');
    });

    $(".q-check-btn").click(function () {
        $(this).qtip('hide');
    });

    $(".q-next-btn").click(function () {
        $(this).qtip('hide');
    });

//Qtip

};

$(document).ready(function () {


    $(Qtiptooltip);


    Draggable.create(".ruler");
    Draggable.create(".protractor");
    Draggable.create("#calculator");


    $("#fromTo").on('click', function () {
        //spin from 0 to 360
        TweenMax.to('#rulerTool', 1, {rotation: "-=1"})
    });

    $("#relative").on('click', function () {
        //spin 360 more than current rotation
        TweenMax.to('#rulerTool', 1, {rotation: "+=1"})
    });

    $("#fromToProtractor").on('click', function () {
        //spin from 0 to 360
        TweenMax.to('#protractorTool', 1, {rotation: "-=1"})
    });

    $("#relativePtotractor").on('click', function () {
        //spin 360 more than current rotation
        TweenMax.to('#protractorTool', 1, {rotation: "+=1"})
    });

//jquery mobile detection

    /**  * jQuery.browser.mobile (http://detectmobilebrowser.com/)  * jQuery.browser.mobile will be true if the browser is a mobile device  **/

    /**if(jQuery.browser.mobile)

     {
        console.log('You are using a mobile device!');
     //var mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
     //var start = mobile ? "touchstart" : "mousedown";
       $("#fromTo").on('click', function(){
         //spin from 0 to 360
          TweenMax.to('#rulerTool', 1, {rotation:"-=1"})
       });

       $("#relative").on('click', function(){
         //spin 360 more than current rotation
         TweenMax.to('#rulerTool', 1, {rotation:"+=1"})
       });

         $("#fromToProtractor").on('click', function(){
         //spin from 0 to 360
          TweenMax.to('#protractorTool', 1, {rotation:"-=1"})
       });

       $("#relativePtotractor").on('click', function(){
         //spin 360 more than current rotation
         TweenMax.to('#protractorTool', 1, {rotation:"+=1"})
       });
     }

     else
     {

     console.log('You are not using a mobile device!');
         $("#fromToProtractor").on('click', function(){
         //spin from 0 to 360
         alert('this is not working');
       });

     }**/

//jquery mobile detection

//click function for nav
    $(".tools-navigation li a").click(function (e) {
        e.preventDefault();
        $(this).addClass('active');
        $(this).parent().siblings().find('a').removeClass('active');


    });
//click funciton for nav

//tooltip

//$('[data-toggle="tooltip"]').tooltip();

//$(".tools-navigation li a").tooltip({trigger: 'manual'}).tooltip('show');
//tooltip	
//Calculator
// Get all the keys from document
    var keys = document.querySelectorAll('#calculator span');
    var operators = ['+', '-', 'x', '÷'];
    var decimalAdded = false;

// Add onclick event to all the keys and perform operations
    for (var i = 0; i < keys.length; i++) {
        keys[i].onclick = function (e) {
            // Get the input and button values
            var input = document.querySelector('.screen');
            var inputVal = input.innerHTML;
            var btnVal = this.innerHTML;

            // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
            // If clear key is pressed, erase everything
            if (btnVal == 'C') {
                input.innerHTML = '';
                decimalAdded = false;
            }

            // If eval key is pressed, calculate and display the result
            else if (btnVal == '=') {
                var equation = inputVal;
                var lastChar = equation[equation.length - 1];

                // Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
                equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

                // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
                if (operators.indexOf(lastChar) > -1 || lastChar == '.')
                    equation = equation.replace(/.$/, '');

                if (equation)
                    input.innerHTML = eval(equation);

                decimalAdded = false;
            }

            // Basic functionality of the calculator is complete. But there are some problems like
            // 1. No two operators should be added consecutively.
            // 2. The equation shouldn't start from an operator except minus
            // 3. not more than 1 decimal should be there in a number

            // We'll fix these issues using some simple checks

            // indexOf works only in IE9+
            else if (operators.indexOf(btnVal) > -1) {
                // Operator is clicked
                // Get the last character from the equation
                var lastChar = inputVal[inputVal.length - 1];

                // Only add operator if input is not empty and there is no operator at the last
                if (inputVal != '' && operators.indexOf(lastChar) == -1)
                    input.innerHTML += btnVal;

                // Allow minus if the string is empty
                else if (inputVal == '' && btnVal == '-')
                    input.innerHTML += btnVal;

                // Replace the last operator (if exists) with the newly pressed operator
                if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                    // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                    input.innerHTML = inputVal.replace(/.$/, btnVal);
                }

                decimalAdded = false;
            }

            // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
            else if (btnVal == '.') {
                if (!decimalAdded) {
                    input.innerHTML += btnVal;
                    decimalAdded = true;
                }
            }

            // if any other key is pressed, just append it
            else {
                input.innerHTML += btnVal;
            }

            // prevent page jumps
            e.preventDefault();
        }
    }

//Calculator

//Draggable.create(".protractor", {type: "rotation", throwProps: true});
//Draggable.create(".ruler", {type: "rotation", throwProps: true});

//$('#stroke-container').css('display:none');
    $('#stroke-container').css({'display': 'none'});
    $('#colorButton').click(function () {
        var $this = $("#colors");
        if ($this.is(':hidden')) {
            $this.show();
        } else {
            $this.hide();
        }
    });


    $('#strokeButton').click(function () {
        var $this = $("#stroke-container");
        if ($this.is(':hidden')) {
            $this.show();
        } else {
            $this.hide();
        }
    });


//$('.protractor').rotatable(params); $('.protractor').draggable();
//$('.ruler').rotatable(params); $('.ruler').draggable();

    $(".previous").hide();
//$( document ).tooltip();

//$( document ).tooltip();

//$( document ).tooltip();
//Json loading	

    $.getJSON('map_data/data.json', function (data) {



//get querystring variable

// Read a page's GET URL variables and return them as an associative array.
        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }


        var name = getUrlVars()["name"];
        quizName = name;


//console.log (name);

//get querystring variable


//var theID = "M10_001";
//console.log( data.skills);
        function getColorOptionSelect(theID) {
            // get label
            var selId;
            var searchTerm = theID;
            var myExp = new RegExp(searchTerm, "i");

            $.each(data.skills, function (i, v) {

                $.each(v, function (key, value) {

                    //reg = new RegExp('\{'+test+'\}', 'i');
                    if (value.name.search(myExp) != -1) {
                        //alert(v.age);
                        //selId = value.Questions;
                        selId = v;
                        //console.log(v);
                        return false;
                    }
                });

            });
            return selId; //<---  Must return something
        }

        var contentId = name;

        var name = getColorOptionSelect(contentId);

//Initialize variable outside
        var output = "";


        $.each(name, function (key, val) {

            $(".heading_div_tut").append("<h3 style='text-align:center'>" + val.Questions + "</h3>");

            $(".heading_div_app").append("<h3 style='text-align:center'>" + val.Questions + "</h3>");

            $(".content_div_tut").append('<iframe src= "' + val.Instructions_path + '" height="500px" frameborder="0" width="80%" class="iframe_instruction center-block" scrolling="yes"></iframe>');


//$( ".Instruction_modal" ).append( "<div>"+ val.Instruction +"</div>" );
// Jquizme //
//Code Starts	
            $.getScript(val.Questions_path, function () {

                var quizMulti = quiz,

                    options = {
                        help: "Try...<ul><li><a href='https://developer.mozilla.org/en/a_re-introduction_to_javascript' target ='_blank'>A Re-introduction to Javascript</a><li><a href='http://www.hunlock.com/blogs/Mastering_Javascript_Arrays' target='_blank'>Mastering Arrays</a></li><li><a href='http://www.jibbering.com/faq/faq_notes/type_convert.html' target='_blank'>Type casting</a></li></ul>",
                        intro: "Use the tools on your left to answer the questions.<br/>Follow the link back to make your own quiz.",
                        //allRandom: false,
                        //showAns: false,
                        title: "Practical Questions demo",
                        quizName: "Quiz Name" /* added by Nguni */
                    };


// Place extra options here //

                options.random = false;
//options.showWrongAns = false;


//options.showAns = false;

                options.title = val.QuestionsTitle;

                options.intro = val.Instruction;
                /* Added by Nguni */
                options.quizName = quizName;


//options.title = "<p>"+ val.QuestionsTitle +"</p>";

// Place extra options here //

// progress bar
                options.statusUpdate = function (info, $questions) {
                    //$( "#score-right" ).html( info.numOfRight );
                    //$( "#score-wrong" ).html( info.numOfWrong );
                    //console.log(info.currIndex);
                    //console.log(info.total);

// progress bar function
                    $(function () {
                        $(".progressbar").progressbar({
//value: info.numOfRight

                            value: info.currIndex, max: info.total

                        });


                    });
// progress bar function

                };
// progress bar	
                $("#questions").jQuizMe(quiz, options);

            });
//Hide answers
            //$(".q-prob").find('.q-result q-probArea').css('display','none');


//Code Ends


// Jquizme //

//loop inside images
            output = "";

            $.each(val.images.path, function (key, val) {

                //console.log(key.length);
                if (key % 4 == 0) {
                    output += '<div class="item">';
                }

                output += '<div class="col-xs-3">';
                output += '<a id= "' + val.id + '" href= "' + val.LargeImgPath + '" data-size="500,400"><span class="desccription_top">' + val.MapName + '</span><img class="img-responsive" src= "' + val.ThumbImgPath + '"/><div class="caption"><span>' + val.QuestionLink + '</span></div><span class="desccription_bottom">' + val.QuestionLink + '</span></a>';
                output += '</div>';

                if (key % 4 == 3) {
                    output += '</div>';
                }
            });


//loop inside images

        });

//console.log(output);

//Show values
//console.log(output);
        $('.carousel-inner').append(output);
//console.log(output);
//$('.carousel-inner').append(output);
        $(".carousel-inner .item:first").addClass("active");
        //Carousel

        $('#myCarousel').carousel({
            interval: 0
        })


//Carousel 


//Show values
//console.log(output);
//$('.zoom_thumbnails').append(output);
//Show values

// Zoom Tools //
        $('.carousel-inner').find('.item .col-xs-3 a').each(function () {
            $(this).bind('click', {src: $(this).attr('href')}, function (e) {

                $(this).find(".desccription_top").show();
                $(this).find(".desccription_bottom").show();

                $(this).parent().siblings().find(".desccription_top").hide();
                //$(this).parent().siblings().find(".desccription_bottom").hide();


                $(this).addClass("current");
                $(this).parent().siblings().find('.current').removeClass('current');
                //Add your zoom settings here
                $('#zoom_container').smoothZoom('destroy').css('background-image', 'url(images/zoom_assets/preloader.gif)').smoothZoom({
                    width: '100%',
                    height: 421,
                    button_ALIGN: "top left",
                    touch_DRAG: false,
                    mouse_DRAG: false,
                    mouse_WHEEL: false,
                    mouse_WHEEL_CURSOR_POS: false,
                    mouse_DOUBLE_CLICK: false,
                    //zoom_BUTTONS_SHOW : 'NO',
                    //pan_BUTTONS_SHOW : 'NO',
                    pan_LIMIT_BOUNDARY: 'NO',
                    initial_ZOOM: 100,
                    zoom_MAX: 150,
                    zoom_MIN: 0,								//Minimum limit for zooming (in percentage)
                    //initial_POSITION: 'top left',
                    //reset_ALIGN_TO: 'top left',

                    /******************************************
                     Additional controls custom set by AM.
                     ******************************************/
                    animation_SMOOTHNESS: 1,
                    animation_SPEED_ZOOM: 1,
                    animation_SPEED_PAN: 1,

                    /******************************************
                     Enable Responsive settings below if needed.
                     Max width and height values are optional.
                     ******************************************/
                    responsive: true,
                    responsive_maintain_ratio: true,
                    max_WIDTH: '',
                    max_HEIGHT: '',
                    image_url: e.data.src
                });
                return false;

            });
        }).eq(0).trigger('click');// JavaScript Document


// Zoom Tools //

        $('.item .col-xs-3 a').hover(
            function () {
                $(this).find('.caption').slideDown(250); //.fadeIn(250)
            },
            function () {
                $(this).find('.caption').slideUp(250); //.fadeOut(205)
            }
        );

    });


//$('#zoom_container').css('width', '100%');
//$("#wPaint").wPaint({});

//$('#canvas_tools').insertBefore('#canvas_area');


    $(".previous").hide();

    $(".tutorial_page").click(function () {

        $(".previous").hide();
        $(".next").show();

        $(this).addClass('active');
        $(".tool_page").removeClass('active');
        $("#content").hide();
        $("#tut_content").show();

    });

    $(".tool_page").click(function () {
        $(".item .col-xs-3:first-child").trigger("click");

//$('.zoom_thumbnails li').first().find("a").trigger("click");

//$(".zoom_thumbnails li a").trigger( "click" );

        $(this).addClass('active');
        $(".tutorial_page").removeClass('active');
        $("#tut_content").hide();
        $("#content").show();

        $(".previous").show();
        $(".next").hide();

    });

    $(".next").click(function () {
        $(".previous").show();
        $(this).hide();

        var n = $(".tutorial_page").hasClass("active");
        if (n == true) {
            $(".tool_page").addClass('active');
            $(".tutorial_page").removeClass('active');
            $(".next").removeClass('active');
            $("#tut_content").hide();
            $("#content").show();
        }
        else {
        }

    });

    $(".previous").click(function () {


        $(".previous").hide();
        $(".next").show();

        var n = $(".tool_page").hasClass("active");

        if (n == true) {
            $(".tutorial_page").addClass('active');
            $(".tool_page").removeClass('active');
            $("#content").hide();
            $("#tut_content").show();
            $(".previous").removeClass('active');
        }
        else {
        }

    });

//$('._wPaint_options').append("<div class='col-md-1 practical_tools'><a rel='protractor' href='#'>Protractor</span></a></div><div class='col-md-1 practical_tools'><a rel='ruler' href='#'>Ruler</span></a></div>" );


    $(".practical_tools a").click(function () {
        var id = $(this).attr("rel");
        var idAlert = $(this).attr("rel");
        var classAlert = idAlert + "Alertbox";
        $(".div-display").hide();
        $("#" + id).show();
        $("#" + classAlert).show();


        //console.log(classAlert);
//funciton to hide on second click
        $(this).click(function (e) {

            divNotifi = $("#" + id);

            if (divNotifi.is(":visible")) {
                divNotifi.hide();
                //$(this).parent().addClass('active').siblings().removeClass('active');
                //$(this).removeClass('active');


            }
            else {
                divNotifi.show();
            }
            return false;
        });
//funciton to hide on second click
    });

    <!-- required for rotate to work -->
    var params = {
        start: function (event, ui) {
            //console.log("Rotating started");
        },
        rotate: function (event, ui) {
            //console.log("Rotating");
        },
        stop: function (event, ui) {
            //console.log("Rotating stopped");
        },
    };
    <!-- required for rotate to work -->

//$('.protractor').rotatable(params); $('.protractor').draggable();
//$('.ruler').rotatable(params); $('.ruler').draggable();
//$('.tools-navigation li a#zoom').click(function(e) {
    //e.preventDefault(); 


    //$("#zoomdata").show();
    //$("#zoomcontrols").show();


//});

    var count = 0;
    $(document).on('click', '.tools-navigation li a#zoom', function () {
        var clicks = $(this).data('clicks');
        if(count == 0) {
            console.log("This is the first time this ish is running.");
            $("#zoomdata").show();
            $("#zoomcontrols").show();
            count++;
        } else {
            if (clicks) {
                // even clicks
                $("#zoomdata").hide();
                $("#zoomcontrols").hide();

            } else {
                // odd clicks
                $("#zoomdata").show();
                $("#zoomcontrols").show();
            }
        }
        $(this).data("clicks", !clicks);
    });

//$('.q-result q-probArea last-child').remove();

//console.log (name);

    $(document).on('click', '.q-begin-btn', function() {
        $('.q-quit-btn').show();
    });
    $(document).on('click', '.q-restart-btn', function() {
        $('.q-quit-btn').hide();
    });
});

//Get Zoom Data //
function writeObject() {
    var zoomDataObject = $('#zoom_container').smoothZoom('getZoomData');
    var roundedZoomval = zoomDataObject.ratio * 100;
    $('#code').html(
        "Scale Ratio:<span style='color:#fff'>" + roundedZoomval.toFixed(2) + "%" + "</span>"
    );
}
//Get zoom data //


/* Added by Nguni */
function saveSkillsActivity(postDataJSON) {
    var url = "/da/skill/api/activity";
    postDataJSON.quizName = quizName;
    // we are in an iframe
    postDataJSON.grade = $("#grade", window.parent.document).val();
    var header = $("meta[name='_csrf_header']", window.parent.document).attr("content");
    var token = $("meta[name='_csrf']", window.parent.document).attr("content");
    var request = $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(postDataJSON),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (msg) {
            //console.log(msg);
        },
        error: function (jqXHR, textStatus, errorThrow) {
            //console.log("Request failed: " + textStatus + ":::" + errorThrow);
        }
    });
}