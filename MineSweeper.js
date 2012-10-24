//create matrix
function createMatrix(row, col, mines){
	var arr = new Array(row);

	for(var i=0; i<arr.length; i++)
	    arr[i] = new Array(col);

	var j=0;

	while(j<mines){
	    var rnum = Math.floor(Math.random()*row*col);
	    var x = Math.floor(rnum/row);
	    var y = rnum%row;
	    if(arr[x][y] !== -1){
	        arr[x][y]=-1;
	        j++;
	    }
	}

	for(var i=0; i<row; i++)
	    for(var j=0; j<col; j++){
	        var count = 0;
	        if(arr[i][j] === -1)
	            continue;
	        else{
	            for(var m=-1; m<=1; m++)
	                for(var n=-1; n<=1; n++){
	                    if((i+m>=0 && i+m<row) && (j+n>=0 && j+n<col) && (arr[i+m][j+n]==-1))
	                        count+=1;
	                }
	            arr[i][j] = count;
	        }
	}
	
	return arr;
	
}

//unbind all events
function unbindAll(){
	$('.iniimg').each(function(){
		$(this).unbind();
	});
}

//open blank

$(document).ready(function($){
	var realminenum = 10;
	var showminenum = 10;
	var uncover = 81;
	var matrix = createMatrix(9,9,10);
	
	function openBlank(m, n){
		//$(pelem).html();
		var queue = [];
		queue.push([m,n]);
		while(queue.length>0){
			var top = queue.shift();
			for(var ii=-1; ii<=1; ii++)
				for(var jj=-1; jj<=1; jj++){
					if((top[0]+ii>=0 && top[0]+ii<9) && (top[1]+jj>=0 && top[1]+jj<9) && (ii|jj!=0)){
						var calID = (top[0]+ii)*9+top[1]+jj;
						if(matrix[top[0]+ii][top[1]+jj]==0 && $('#'+ calID).html()!== ""){
							$('#'+ calID).html("");
							queue.push([top[0]+ii, top[1]+jj]);									
						}
						else if(matrix[top[0]+ii][top[1]+jj]>0){
							var cn = 'e'+matrix[top[0]+ii][top[1]+jj];
							$('#'+calID).html('<span class='+cn+'>'+matrix[top[0]+ii][top[1]+jj]+'</span>');
						}
					}
				}
		}

	}
	
	
	$('#ShowMineNum').html(showminenum+'');		
	$('.iniimg').each(function(){
		//left click event		
		$(this).live('click',function(e){
			var pelem = this;
			var id = pelem.id-'0';
			var m = Math.floor(id/9);
			var n = id%9;
			var x = matrix[m][n];
			$(pelem).children("img:first").remove();
			if(x==-1){
				var imgbomb = document.createElement('img');
				imgbomb.src = "icons/mine.ico";
				imgbomb.width =25;
				imgbomb.height =25;
				pelem.appendChild(imgbomb);
				$('#result').addClass('lost').html("YOU LOSE! TRY AGAIN");
				unbindAll();
			}
			else if(x==0){
				openBlank(m,n);
			}				
			else{
				var cname = 'e'+x;
				$(pelem).html('<span class='+cname+'>'+x+'</span>');				
			}
			e.stopPropagation()			
		});
		
		//right click event
		$(this).live("contextmenu", function(e){
			e.preventDefault();
			var pnode = this;
			var id = pnode.id-'0';
			var x = Math.floor(id/9);
			var y = id%9;
			// uncovered spot
			if($(pnode).children("img:first").attr("class") === "coverSquare"){
				showminenum -= 1;
				$("#ShowMineNum").html(showminenum+'');
				var img = document.createElement('img');
				img.src = 'icons/tile3.ico';
				img.width = 35;
				img.height = 35;
				img.className = "flag";
				$(pnode).children("img:first").remove();
				pnode.appendChild(img);
				if(matrix[x][y]==-1){
					realminenum -=1;
					if(realminenum == 0 && showminenum == 0){
						$("#result").addClass("win").html("YOU WIN!!");
						unbindAll();
					}
				}
			}
			// undo marked spot
			else if($(pnode).children("img:first").attr("class") === "flag"){
				showminenum += 1;
				$("#ShowMineNum").html(showminenum+'');
				var img = document.createElement('img');
				img.src = 'icons/tile.ico';
				img.width = 35;
				img.height = 35;
				img.className = "coverSquare";
				$(pnode).children("img:first").remove();
				pnode.appendChild(img);
				if(matrix[x][y] == -1){
					realminenum += 1;
				}
			}
			// covered spot
			else{
				var ucmine = 0;
				var minearray= [];
				var ucarray = [];
				var blankarray = [];
				var isLose = false;
				
				for(var t1=-1; t1<=1; t1++)
					for(var t2=-1; t2<=1; t2++){
						var tid = (x+t1)*9+y+t2;
						if((x+t1>=0 && x+t1<9) && (y+t2>=0 && y+t2<9) && (t1|t2!=0) && ($('#'+tid).html() != '')){
							if(matrix[x+t1][y+t2]==-1){
								if($('#'+tid).children('img:first').attr('class')==="coverSquare"){
									ucmine+=1;
									minearray.push(tid);
								}
							}
							else if(matrix[x+t1][y+t2]>0){
								if($('#'+tid).children('img:first').attr('class')==="flag"){
									isLose = true;
								}
								else{
									ucarray.push(tid);
								}
							}
							else{
								blankarray.push([x+t1, y+t2]);
							}
						}
					}	
					
				if(isLose){
					for(var t=0; t<minearray.length; t++){
						$('#'+minearray[t]).children('img:first').attr('src','icons/mine.ico').attr('height', '25px').attr('width','25px');
					}
					$('#result').addClass('lost').html("YOU LOSE! TRY AGAIN");
					unbindAll();
				}
				else{
					if(ucmine>0){
						//blink the uncovered spot
					}
					else{
						for(var t=0; t<ucarray.length; t++){
							$('#'+ucarray[t]).html('<span class="e'+ matrix[Math.floor(ucarray[t]/9)][ucarray[t]%9] +'">'+matrix[Math.floor(ucarray[t]/9)][ucarray[t]%9]+'</span>');
						}
						
						for(t=0; t<blankarray.length; t++){
							openBlank(blankarray[t][0], blankarray[t][1]);
						}
					}
				}
				
				
			}
			
			
			
		});
	})
	
});