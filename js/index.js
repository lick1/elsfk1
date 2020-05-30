var lotay = document.querySelector('.elx-lotay');

//定义变量
const STEP = 30; // 方块容器为20*20
//将背景容器进行分割 为 18行 ，10列 行高，列高为20
const ROW = 18;
const LINE = 10;
var num = 0;  // 得分

//存储模型的类型
var piecemodel = '';

//模型的位置初始化
var modelrow = -3;
var modelline = 3;
//记录所有块元素
var fixdBlocks = {};
var modelRandom = 0;
var Time = ''
//创建模型
var model = [
	//L模型
	{
		0: {
			row: 2,
			line: 0
		},
		1: {
			row: 2,
			line: 1
		},
		2: {
			row: 2,
			line: 2
		},
		3: {
			row: 1,
			line: 2
		}
	},
	//反L模型
	{
		0: {
			row: 2,
			line: 0
		},
		1: {
			row: 2,
			line: 1
		},
		2: {
			row: 2,
			line: 2
		},
		3: {
			row: 1,
			line: 0
		}
	},
	//z模型
	{
		0: {
			row: 1,
			line: 0
		},
		1: {
			row: 1,
			line: 1
		},
		2: {
			row: 2,
			line: 1
		},
		3: {
			row: 2,
			line: 2
		}
	},
	//反z模型
	{
		0: {
			row: 2,
			line: 0
		},
		1: {
			row: 2,
			line: 1
		},
		2: {
			row: 1,
			line: 1
		},
		3: {
			row: 1,
			line: 2
		}
	},
	//凸模型
	{
		0: {
			row: 2,
			line: 0
		},
		1: {
			row: 2,
			line: 1
		},
		2: {
			row: 2,
			line: 2
		},
		3: {
			row: 1,
			line: 1
		}
	},
	//田子模型
	{
		0: {
			row: 1,
			line: 1
		},
		1: {
			row: 1,
			line: 2
		},
		2: {
			row: 2,
			line: 1
		},
		3: {
			row: 2,
			line: 2
		}
	},
	//直线模型
	{
		0: {
			row: 0,
			line: 0
		},
		1: {
			row: 0,
			line: 1
		},
		2: {
			row: 0,
			line: 2
		},
		3: {
			row: 0,
			line: 3
		}
	}
];

var bnt = document.querySelector('.ok');
var bnt1 = document.querySelector('.get');
//函数初始化
boardBoard();
bnt.onclick = function(){
	rendex();
	
}

function rendex() {
	// console.log(arr);
	
	addModel();
	onKeyDown();
	// Time = '';
	Time = setInterval(function() {
			boxMove(0, 1);
	}, 500)
}

function boardBoard() {
	const c = document.getElementById("myCanvas");
	const ctx = c.getContext('2d');
	// moveTo(x,y)  直线的开始点的坐标
	//lineTo(x,y)   直线的结束点的坐标
	//使用 stroke() 方法来绘制线条
	ctx.strokeStyle = '#fff';
	for (var i = 0; i < 540/STEP; i++) {
		ctx.moveTo(0, STEP * i );
		ctx.lineTo(300, STEP * i );
		// ctx.moveTo(STEP * i, 0);
		// ctx.lineTo(STEP * i, 360);
	};
	for (var i = 0; i < 300/STEP; i++) {
		// ctx.moveTo(0, STEP * i );
		// ctx.lineTo(200, STEP * i );
		ctx.moveTo(STEP * i, 0);
		ctx.lineTo(STEP * i, 540);
	};
	ctx.stroke();
	
}
//1.按键
function onKeyDown() {
	document.onkeydown = function(e) {
		// console.log(e.keyCode);
		switch (e.keyCode) {
			case 38:
				// console.log('上');
				modelRotation();
				break;
			case 39:
				// console.log('右');
				boxMove(1, 0);
				break;
			case 40:
				// console.log('下');
				boxMove(0, 1);
				break;
			case 37:
				// console.log('左');
				boxMove(-1, 0);
				break;
		}
	}
}

//2.块移动  模型移动
function boxMove(X, Y) {

	//模型之间的碰撞
	if (moveCrash(modelrow + Y, modelline + X, piecemodel)) {
		//是y改变值的情况下，才能改变改变
		if (Y != 0) {
			// 判断模型之间的碰撞时，样式改变
			moveBotton();
		}
		return;
	}

	modelrow = modelrow + Y;
	modelline = modelline + X;
	//只能在容器中移动
	lotayMove();
	//方块对应的模型中，进行定位div
	Location();

}

//3.添加模型
function addModel() {
	if (isGameOver()) {
		gameOver();
		return;
	}
	//调用时机函数生成新的模型
	modelRandom = Random(0, model.length - 1);
	//获取新模型的数据
	piecemodel = model[modelRandom];
	// console.log(piecemodel);
	//遍历新模型的长度，添加div
	for (var k in piecemodel) {
		var div = document.createElement('div');
		div.classList = 'diamond-model';
		//添加div到lotay里
		lotay.appendChild(div);
	};
	Location();
	document.querySelector('#scores span').innerText = num;
}
//4.方块对应的模型中，进行定位div
function Location() {
	//获取模型中全部div
	var divs = document.querySelectorAll('.diamond-model');
	// console.log(divs);
	divs.forEach(function(v, i) {
		v.style.top = (piecemodel[i].row + modelrow) * STEP + 'px';
		v.style.left = (piecemodel[i].line + modelline) * STEP + 'px';
	})
}

//5.控制模型进行旋转
function modelRotation() {
	// piecemodel.forEach(function(v,i){
	// 	console(v);
	// })
	/**
	 * 算法
	 * - 旋转后行 = 旋转前列 
	 * - 旋转后列 = 3-旋转前行
	 */
	var clonePiecemodel = _.cloneDeep(piecemodel);

	for (var k in clonePiecemodel) {
		//获取块元素
		var blockModel = clonePiecemodel[k];
		//实现块的算法
		var temp = blockModel.row;
		blockModel.row = blockModel.line;
		blockModel.line = 3 - temp;
	}
	//判断旋转之后是否与块接触
	if (moveCrash(modelrow, modelline, clonePiecemodel)) {
		return;
	}
	//接受旋转
	piecemodel = clonePiecemodel;
	Location();
}

//6.控制模型只能在容器中移动
function lotayMove() {
	var leftMove = 0,
		rightMove = ROW,
		bottonMove = LINE
	for (var k in piecemodel) {
		var blockModel = piecemodel[k];
		//判断模型位置是否超出容器边框
		if (blockModel.line + modelline < leftMove) {
			modelline++;
		}
		if (blockModel.line + modelline >= bottonMove) {
			modelline--;
		}
		if (blockModel.row + modelrow >= rightMove) {
			modelrow--;
			moveBotton();

		}
	}

}

//7.模型与背景容器底部碰撞时,样式改变
function moveBotton() {
	var diamonds = document.querySelectorAll('.diamond-model');
	for (var i = diamonds.length - 1; i >= 0; i--) {
		//拿到每个块元素
		// console.log(diamonds.length);
		var modelEle = diamonds[i];
		modelEle.className = 'bottom-model';
		var blockModel = piecemodel[i];
		var mbr = modelrow + blockModel.row;
		fixdBlocks[modelline + blockModel.line + '_' + mbr] = modelEle;

	};
	// 当前行是否已经被铺满了
	isRemoveLine();
	// console.log(fixdBlocks);
	//模型的位置
	modelrow = -1;
	modelline = 3;
	// 重新添加模型
	addModel();

}

//8.判断模型之间的碰撞
function moveCrash(x, y, model) {
	for (var k in model) {
		//获取块元素
		var blockModel = model[k];

		var xbr = x + blockModel.row;
		// console.log(y + blockModel.line + '_' + xbr);
		//判断是否存在模型
		if (fixdBlocks[y + blockModel.line + '_' + xbr]) {
			return true;
			// console.log(11);
		}
	}
	return false;
	// console.log(fixdBlocks);
	// console.log(22);
}

//9.判断一行是否被铺满
function isRemoveLine() {
	for (var i = 0; i < ROW; i++) {
		//标记符，假设当前行已经被铺满了
		var flag = true;
		for (var j = 0; j < LINE; j++) {
			//假设当前行没有数据，那么当前行没有；已经被铺满了；
			if (!fixdBlocks[j + '_' + i]) {
				flag = false;
				break;
			}
		}
		if (flag) {
			// console.log('已经被铺满');
			num++
			removeLine(i);
		}
	}
}
//10.清理行被铺满
function removeLine(line) {

	for (var i = 0; i < LINE; i++) {
		document.querySelector('.elx-lotay').removeChild(fixdBlocks[i + '_' + line]);
		fixdBlocks[i + '_' + line] = null;
	}
	downLine(line);
}

// 11.被清理行之上的块元素下落
function downLine(line) {
	//遍历
	for (var i = line - 1; i >= 0; i--) {
		for (var j = 0; j < LINE; j++) {
			if (!fixdBlocks[j + '_' + i]) continue;
			//存在数据
			//1.被清理理行之上的所有块元素数据源所在行数 + 1
			fixdBlocks[j + '_' + (i + 1)] = fixdBlocks[j + '_' + i];
			// 行之上的所有块元素数据下落
			fixdBlocks[j + '_' + (i + 1)].style.top = (i + 1) * STEP + 'px';
			//清理之前的块元素
			fixdBlocks[j + '_' + i] = null;
		}
	}
}

//12.随机生成模型
function Random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}
//13.定时器开启
// var Time = setInterval(function() {
// 	boxMove(0, 1);
// }, 1000)
//14.判断游戏是否结束
function isGameOver() {
	for (var i = 0; i < LINE; i++) {
		if (fixdBlocks[i + '_0']) {
			return true;
		}
	}
	return false;
}
//15.游戏结束
function gameOver() {
	if (Time) {
		clearInterval(Time);
	}
		alert('游戏失败');
		clear();
	// var Time = ''
}
//重新游戏
bnt1.onclick = function(){
	// clearInterval(Time);
	clear();
	
	
}

function clear(){
	var target = document.querySelector('.elx-lotay')
	var div = target.querySelectorAll(".bottom-model");
	div.forEach(function(info){
		target.removeChild(info);
	})
	var div1 = target.querySelectorAll(".diamond-model");
	div1.forEach(function(info){
		target.removeChild(info);
	})
	piecemodel = '';
	num = 0; 
	//模型的位置初始化
	 modelrow = -4;
	 modelline = 3;
	//记录所有块元素
	 fixdBlocks = {};
	 modelRandom = 0;
	rendex();
}

var set = document.querySelector('.set');

set.onclick = function(){
	// console.log(11);
	if (Time) {
		clearInterval(Time);
		set.innerText = '开启游戏';
		Time = '';
	}else{
		set.innerText = '暂停游戏';
		Time = setInterval(function() {
				boxMove(0, 1);
		}, 500)
		
	}
}