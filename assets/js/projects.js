/*
	Dynamically generate projects from JSON for Parallelism by HTML5 UP
	Christian Frisson
	MIT licensed
*/

function initProjects(thumbHeight){
    d3.json("projects.json",function(error,data){
		var people = data.people;
        var article = d3.select("#reel")
        .selectAll("item thumb")
        .data(data.projects)
        .enter()
        .append(function(d) { 
            return document.createElement("article");
        })
        .attr("data-width",function(d){
            return (d.thumb.width * thumbHeight / d.thumb.height);
        })
        .attr("class","item thumb")
        article.append(function(d) { 
            var h2 = document.createElement("h2");
            var innerHTML = d.title;
            innerHTML += " (";
            if(d.eventName !== undefined){
                innerHTML += d.eventName;
            }
            if(d.eventName !== undefined && d.eventYear !== undefined){
                innerHTML += " ";
            }
            if(d.eventYear !== undefined){
                innerHTML += d.eventYear;
            }
            innerHTML += ")";
            h2.innerHTML = innerHTML;
            return h2;
        });
        article.append(function(d) { 
            var a = document.createElement("a");
            a.className="image";
            if(d.video !== undefined ){
                a.href = "http://vimeo.com/" + d.video.id;
                a.setAttribute("data-poptrox","vimeo,800x480");                                
            }
            else if(d.image !== undefined ){
                a.href = "images/fulls/" + d.image.stem;
            }
            else{
                a.href = "images/fulls/" + d.thumb.stem;
            }
            return a;
        })
            .append(function(d) { 
            var img = document.createElement("img");
            if(d.thumb.stem !== undefined)
                img.src = "images/thumbs/" + d.thumb.stem;
            // Pass caption to poptrox
            d.caption = d.title;
            d.caption += " (";
            if(d.eventName !== undefined){
                d.caption += d.eventName;
            }
            if(d.eventName !== undefined && d.eventYear !== undefined){
                d.caption += " ";
            }
            if(d.eventYear !== undefined){
                d.caption += d.eventYear;
            }
            d.caption += ")";
            d.caption += "<ul>"
            if(d.subtitle !== undefined){
                d.caption += "<li>" + d.subtitle + "</li>";
            }
            if(d.publication !== undefined){
                if(d.publication.people !== undefined){
                    d.caption += "<li>collaboration between ";
                    for(var n=0;n<d.publication.people.length;n++){
						var author= people.find(
							function(e){
								if(d.publication.people[n][0] == e.given && d.publication.people[n][1] == e.family){
									return e;
								}
							});
						if(author !== undefined){
	                        d.caption += author.given;
	                        d.caption += " ";
	                        d.caption += author.family;
	                        if(n<d.publication.people.length-1){
	                            d.caption += ", ";
	                        }
						}
                    }
                    d.caption += "</li>";
                }            
                if(d.publication.conference !== undefined){
					d.caption += "<li>"
					if(d.publication.type !== undefined){
						d.caption += d.publication.type;
						d.caption += " "
					}
					if(d.publication.presentation !== undefined){
						if(d.publication.presentation == "demo"){
							d.caption += "presented as demo "
						}
						else if(d.publication.presentation == "oral"){
							d.caption += "with oral/visual presentation "
						}
						else{
							d.caption += d.publication.presentation;
							d.caption += " "
						}
					}
                    d.caption += "at the ";
                    d.caption += d.publication.conference;
					d.caption += " conference";
					if(d.publication.series !== undefined){
						d.caption += " ("
						d.caption += d.publication.series;
						d.caption += ")"
					}
                    if(d.publication.location !== undefined){
                        if(d.publication.location.city !== undefined){
                            d.caption += ", " + d.publication.location.city;
                        }
                        if(d.publication.location.country !== undefined){
                            d.caption += ", " + d.publication.location.country;
                        }
                    }
                    d.caption += "</li>";
                }
            }
            if(d.dataset !== undefined){
                d.caption += "<li>dataset: " + d.dataset + "</li>";
            }
            if(d.contribs !== undefined){
                d.caption += "<li>my contributions: " + d.contribs + "</li>";
            }
            d.caption += "</ul>"
            return img;
        })        
    });   
};