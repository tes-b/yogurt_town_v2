var canvas = document.getElementById('canvas');

var header = document.body.getElementsByTagName('header')[0];
//var footer = document.body.getElementsByTagName('footer')[0];
var bodyheight = document.body.clientHeight;

canvas.setAttribute("Height", bodyheight - header.clientHeight);
canvas.setAttribute("Width", window.innerWidth);

var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // �̹��� �ε巴�� ó������ ����