var express=require('express');
var app=express();
var fs=require('fs');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});

var mysql=require('mysql');
var connection=mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	port:'3306',
	database:'mvc'
});
connection.connect();
//获取列表
app.get('/',function(req,res){
	var file=fs.readFileSync(__dirname+'/'+'web_index.html');
	var query='select * from nodejs';
	connection.query(query,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
		var data='';
		for(var i=0;i<result.length;i++){
			data+='<tr height="30" align="center">';
			data+='<td>'+result[i].id+'</td>';
			data+='<td>'+result[i].name+'</td>';
			data+='<td>'+result[i].sex+'</td>';
			data+='<td>'+result[i].age+'</td>';
			data+='<td>'
			data+='<a href="/web_edit/'+result[i].id+'" >修改</a>|';
			data+='<a href="/web_del/'+result[i].id+'" >删除</a></td>';
			data+='</tr>';
		}
		var aaa=file.toString();
		res.write(aaa.replace(/{{data}}/,data));
		res.send();
	});
});
//显示添加数据页面
app.get('/web_add',function(req,res){
	res.sendFile(__dirname+'/'+'web_add.html');
});
//处理提交数据
app.post('/web_post',urlencodedParser,function(req,res){
	var query='insert into nodejs(name,sex,age) values(?,?,?)';
	var data=[req.body.name,req.body.sex,req.body.age];
	connection.query(query,data,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect('/');
	});
});
//显示修改的数据
app.get('/web_edit/:id',function(req,res){
	var file=fs.readFileSync(__dirname+'/'+'web_edit.html');
	var query='select * from nodejs where id=?';
	var data=[req.params.id];
	connection.query(query,data,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
		var aaa=file.toString();
		//正则替换
		var bbb=aaa.replace(/{{name}}/,result[0].name).replace(/{{sex}}/,result[0].sex).replace(/{{age}}/,result[0].age).replace(/{{id}}/,result[0].id);
		res.write(bbb);
		res.send();
	});
});
//保存修改数据
app.post('/web_edit_post',urlencodedParser,function(req,res){
	var query='update nodejs set name=?,sex=?,age=? where id=?';
	var data=[req.body.name,req.body.sex,req.body.age,req.body.id];
	connection.query(query,data,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect('/');
	});
});
//删除数据
app.get('/web_del/:id',function(req,res){
	var query='delete from nodejs where id=?';
	var data=[req.params.id];
	connection.query(query,data,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect('/')
	});
});


//创建服务器
var server=app.listen(8080,function(){
	var host=server.address().address;
	var port=server.address().port;
});