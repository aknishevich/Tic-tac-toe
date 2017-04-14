var turn = "cross", p1 = "cross", p2 = "circle", stepsForward = new Array();
var stepsBack = new Array(), r = 3, c = 3, z = 3, field = new Array();
var winner = new Array();
function fieldGenerate(a,b){
	field = matrixArray(a,b);
	for (var i = 0; i < a; i++){
		$(".gameField").append('<div class="row"></div>');
		for (var j = 0; j < b; j++){
			$(".row").last().append('<div class="cell '+i+'_'+j+ '" onclick="clicked(this)"></div>');
		}
	}
	$('.gameField .cell').hover(
       function(){ 
       	if (this.className.indexOf(p1) === -1 && this.className.indexOf(p2) === -1){
       		if(turn === "circle") $(this).addClass("crcl_active");
       		else $(this).addClass("crs_active");
       	}
       },
       function(){ 
       	$(this).removeClass("crcl_active")
       	$(this).removeClass("crs_active") 
       }
    );
    $(".row").css("height", 100/r+"%");
    $(".cell").css("width", 100/c+"%");
    var w = $(".cell").width();
    var h = $(".row").height();
    if (h === 20 || w === 20){
    	$(".row").css("height", "20px");
    	$(".cell").css("height", "20px");
    	$(".cell").css("width", "20px");
    }
    else{
    	if(w < h){
    		$(".row").css("height", $(".cell").width()+"px");
    		$(".cell").css("height", $(".cell").width()+"px");
    	}
    	else if (h < w)
    		$(".cell").css("width", h+"px");
    }
}
function matrixArray(rows,columns){
  var arr = new Array();
  for(var i=0; i<rows; i++){
    arr[i] = new Array();
    for(var j=0; j<columns; j++){
      arr[i][j] = null;
    }
  }
  return arr;
}
function fieldRefresh(){
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			var elem = $("."+i+"_"+j).attr('class');
			if (elem.indexOf(p1) != -1) field[i][j] = 1;
			else if (elem.indexOf(p2) != -1) field[i][j] = 0;
			else field[i][j] = null;
		}
	}
}
function Apply(){
	var val = $("#selectField").val();
	if (val == 1){
		r = 3; c = 3; z = 3;
	}
	else if (val == 2){
			r = 5; c = 5; z = 4;
			}
		else if (val == 3){
			r = 10; c = 10; z = 5;
		}
			else if (val == 4){
				r = 15; c = 15; z = 5;
			}
	remove();
}
function Enter(){
	var row = $("input[name='rowCount']"), column = $("input[name='cellCount']"), steps = $("input[name='stepsCount']"), validate = rowVal = columnVal = stepsVal= 0;
	for (var i = 0; i <= 30; i++){
		if (row.val() == i) rowVal = i;
	}
	for (var j = 0; j <= 30; j++){
		if (column.val() == j) columnVal = j;
	}
	for (var k = 0; k <= 10; k++){
		if (steps.val() == k) stepsVal = k;
	}
	if (rowVal >= 3 && rowVal <= 30) validate++;
	if (columnVal >= 3 && columnVal <= 30) validate++;
	if (stepsVal >= 3 && stepsVal <= 10) validate++;
	if (stepsVal <= rowVal && stepsVal <= columnVal) validate++;
	if (validate === 4){
		r = row.val();
		row.val('');
		c = column.val();
		column.val('');
		z = steps.val();
		steps.val('');
		remove();
	}
}
function clear(){
	for(var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			$("."+i+'_'+j).removeClass("winp2");
			$("."+i+'_'+j).removeClass("winp1");
		}
	}
}
function remove(){
	$(".row").remove();
	stepsForward.splice(0,stepsForward.length);
	stepsBack.splice(0,stepsBack.length);
	fieldGenerate(r,c);
	turn = "cross";
}
function p1Win(){
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			$("."+i+'_'+j).removeAttr('onclick');
		}
	}
	for (var k = 0; k < winner.length; k++){
		$("."+winner[k]).addClass("winp1");
	}
	stepsBack.splice(0,stepsBack.length);
	turn = "cross";
}
function p2Win(){
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			$("."+i+'_'+j).removeAttr('onclick');
		}
	}
	for (var k = 0; k < winner.length; k++){
		$("."+winner[k]).addClass("winp2");
	}
	stepsBack.splice(0,stepsBack.length);
	turn = "circle";
}
function draw(){
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			$("."+i+'_'+j).removeAttr('onclick');
		}
	}
	stepsBack.splice(0,stepsBack.length);
	alert("Draw!");
}
function check(){
	count = 0;
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++) {
			if (field[i][j] != null){
				if (gorCheck(i,j) === 0)
					if (vertCheck(i,j) === 0)
						if (diagLCheck(i,j) === 0) 
							if (diagRCheck(i,j) === 0){
								count++;
								if (count >= c * r) draw();
							}
							else break;
						else break;
					else break;
				else break;
			}
		}
	}
}
function gorCheck(a,b){
	var val = 0, last = "";
		for (var j = b; j < c; j++){
			if (field[a][j] === 1 && last === p1) {
				winner[winner.length] = a + '_' + j;
				val++;
				if (val >= z) {
					p1Win();
					return 1;
					break;
				}
			}
			else if (field[a][j] === 1 && last != p1){
				winner.splice(0,winner.length);
				winner[0] = a + '_' + j;
				val = 1;
				last = p1;
			}
			else if (field[a][j] === 0 && last === p2) {
				winner[winner.length] = a + '_' + j;
				val++;
				if (val >= z) {
					p2Win();
					return 1;
					break;
				}
			}
			else if (field[a][j] === 0 && last != p2){
				winner.splice(0,winner.length);
				winner[0] = a + '_' + j;
				val = 1;
				last = p2;
			}
			else {
				val = 0;
				last = "";
			}
		}
	return 0;
}
function vertCheck(a,b){
	var val = 0, last = "";
		for (var j = a; j < r; j++){
			if (field[j][b] === 1 && last === p1) {
				winner[winner.length] = j + '_' + b;
				val++;
				if (val >= z) {
					p1Win();
					return 1;
					break;
				}
			}
			else if (field[j][b] === 1 && last != p1){
				winner.splice(0,winner.length);
				winner[0] = j + '_' + b;
				val = 1;
				last = p1;
			}
			else if (field[j][b] === 0 && last === p2) {
				winner[winner.length] = j + '_' + b;
				val++;
				if (val >= z) {
					p2Win();
					return 1;
					break;
				}
			}
			else if (field[j][b] === 0 && last != p2){
				winner.splice(0,winner.length);
				winner[0] = j + '_' + b;
				val = 1;
				last = p2;
			}
			else {
				val = 0;
				last = "";
			}
		}
	return 0;
}
function diagLCheck(a,b){
			var val = 0, last = "";
			for (var d = a, k = b; d < r; d++, k++){
				if (k === c) break;
				else{
					if (field[d][k] === 1 && last === p1) {
						winner[winner.length] = d + '_' + k;
						val++;
						if (val >= z) {
							p1Win();
							return 1;
							break;
						}
					}
					else if (field[d][k] === 1 && last != p1){
						winner.splice(0,winner.length);
						winner[0] = d + '_' + k;
						val = 1;
						last = p1;
					}
					else if (field[d][k] === 0 && last === p2) {
						winner[winner.length] = d + '_' + k;
						val++;
						if (val >= z) {
							p2Win();
							return 1;
							break;
						}
					}
					else if (field[d][k] == 0 && last != p2){
						winner.splice(0,winner.length);
						winner[0] = d + '_' + k;
						val = 1;
						last = p2;
					}
					else {
						val = 0;
						last = "";
					}
				}
			}
	return 0;
}
function diagRCheck(a,b){
	var val = 0, last = "";
	for (var d = a, k = b; d < r; d++, k--){
		if (k === -1) break;
		else{
			if (field[d][k] === 1 && last === p1) {
						winner[winner.length] = d + '_' + k;
						val++;
						if (val >= z) {
							p1Win();
							return 1;
							break;
						}
					}
					else if (field[d][k] === 1 && last != p1){
						winner.splice(0,winner.length);
						winner[0] = d + '_' + k;
						val = 1;
						last = p1;
					}
					else if (field[d][k] === 0 && last === p2) {
						winner[winner.length] = d + '_' + k;
						val++;
						if (val >= z) {
							p2Win();
							return 1;
							break;
						}
					}
					else if (field[d][k] == 0 && last != p2){
						winner.splice(0,winner.length);
						winner[0] = d + '_' + k;
						val = 1;
						last = p2;
					}
					else {
						val = 0;
						last = "";
					}
				}
			}
	return 0;
}
function back(){
	if (stepsBack[stepsBack.length-1]){
		var data = stepsBack[stepsBack.length-1].split("_");
		field[data[0]][data[1]] = null;
		$("."+stepsBack[stepsBack.length-1]).removeClass("cross");
		$("."+stepsBack[stepsBack.length-1]).removeClass("circle");
		stepsForward[stepsForward.length] = stepsBack[stepsBack.length-1];
		stepsBack.splice(stepsBack.length-1,1);
		if (turn === "cross") turn = "circle";
		else turn = "cross";
	}
}
function forward(){
	if (stepsForward[stepsForward.length-1]){
		var data = stepsForward[stepsForward.length-1].split("_");
		$("."+stepsForward[stepsForward.length-1]).addClass(turn);
		stepsBack[stepsBack.length] = stepsForward[stepsForward.length-1];
		stepsForward.splice(stepsForward.length-1, 1);
		if (turn === "cross") {
			field[data[0]][data[1]] = 1;
			turn = "circle";
		}
		else {
			field[data[0]][data[1]] = 0;
			turn = "cross";
		}
	}
}
function clicked(obj){
	var clas = obj.className.split(" ");
	var data = clas[1].split("_");
	if (field[data[0]][data[1]] === null) {
		$("."+clas[1]).addClass(turn);
		$(obj).removeClass("crs_active");
		$(obj).removeClass("crcl_active");
		if (turn === "cross") turn = "circle";
		else turn = "cross";
		stepsBack[stepsBack.length] = clas[1];
		stepsForward.splice(0,stepsForward.length);
		fieldRefresh();
	}
	check();
};
fieldGenerate(r, c);