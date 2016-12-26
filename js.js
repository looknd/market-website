(function(){
  var getList = function(callback){
    var url = "http://weex-market.taobao.net/json/weexExt/list.jsonp?callback=?"
    $.getJSON(url, function(result){
      var data = result.data;
      var html = ""
      for(var i=0;i<data.length;i++){
        html+= '<div class="list-group-item packages" data-id="'+data[i].id+'">' +
            '<a class="package" >'+data[i].name+'</a>' +
            '<p class="desc">'+(data[i].description||" ")+'</p>'+
            '<span class="version">'+(data[i].lastestVersion.version||" ")+'</span>'+
            '</div>'
      }
      $("#list").html(html);
      callback&&callback()
    })
  }


  var showLoading = function(){
    $("#detail").html('<div class="loading">loading...</div>')
  }


  var isLoading = false
  var getDetail = function(id,callback){

    var url = "http://weex-market.taobao.net/json/weexExt/readme.jsonp?callback=?&id="+id
    isLoading = true;

    showLoading();
    $.getJSON(url, function(result){
      isLoading = false;
      callback&&callback(result)
    })
  }

  var toHTML = function(markdown){
    var readme_markdown = Base64.decode(markdown);

    var converter = new showdown.Converter()
    return converter.makeHtml(readme_markdown);
  }


  var renderDetail = function(result){
    $("#detail").html(toHTML(result.data))
  }



  var addEvent = function(){
    $("#list").on("click",".list-group-item", function(ev){
      if(isLoading){
        return;
      }
      var target = $(ev.currentTarget);
      var id = target.attr("data-id")
      actived(target)

      if(id){
        getDetail(id, function(result){
          renderDetail(result)
        })
      }
    })
  }

  var actived = function(el){
    var target = $("#list .list-group-item");
    target.removeClass("active")
    el.addClass("active")
  }

  var initFirst = function(){
    var target = $("#list .list-group-item").eq(0);
    actived(target)
    var id = target.attr("data-id")
    if(id){
      getDetail(id, function(result){
        renderDetail(result)
      })
    }
  }



  getList(function(){
    setTimeout(function(){
      initFirst();
    },0)
  })

  addEvent()

