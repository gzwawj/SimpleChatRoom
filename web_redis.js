var express=require('express');
var app=express();
var fs=require('fs');
var bodyParset=require('body-parser');
var urlencodedParser=bodyParset.urlencoded({extended:false});

var redis=require('redis');
var connection=redis.createClient({
	host:'127.0.0.1',
	port:'6379'
});
//显示列表页
app.get('/',function(req,res){
	var file=fs.readFileSync(__dirname+'/'+'web_index.html');
	connection.zrange('nodejs','0','-1','withscores',function(err,result){
		res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
		var data='';
		for(var i=0;i<result.length;i++){
			var item=JSON.parse(result[i]);
			if(isNaN(item)){
				data+='<tr height="30" align="center">';
				data+='<td>'+i/2+'</td>';
				data+='<td>'+item.name+'</td>';
				data+='<td>'+item.sex+'</td>';
				data+='<td>'+item.age+'</td>';
				data+='<td>'
				data+='<a href="/web_edit/'+i/2+'" >修改</a>|';
				data+='<a href="/web_del/'+i/2+'" >删除</a></td>';
				data+='</tr>';
			}
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
//保存添加的数据
app.post('/web_post',urlencodedParser,function(req,res){
	var data={
		'name':req.body.name,
		'sex':req.body.sex,
		'age':req.body.age
	};
	var aaa=JSON.stringify(data);
	connection.zcard('nodejs',function(err,list){
		connection.zadd('nodejs',list,aaa,function(error,result){
			if(err){
				return console.log(err);
			}
			res.redirect('/');
		});
	});
});
//显示修改的数据
app.get('/web_edit/:id',function(req,res){
	var file=fs.readFileSync(__dirname+'/'+'web_edit.html');
	var data=parseInt(req.params.id);
	connection.zrange('nodejs',data,data,'withscores',function(err,result){
		var item=JSON.parse(result[0]);
		res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
		var aaa=file.toString();
		//正则替换
		var bbb=aaa.replace(/{{name}}/,item.name).replace(/{{sex}}/,item.sex).replace(/{{age}}/,item.age).replace(/{{id}}/,data);
		res.write(bbb);
		res.send();
	});
});
//保存修改的数据
app.post('/web_edit_post',urlencodedParser,function(req,res){
	var data={
		'name':req.body.name,
		'sex':req.body.sex,
		'age':req.body.age
	};
	var aaa=JSON.stringify(data);
	var id=parseInt(req.body.id);
	connection.zcard('nodejs',function(err,list){
		if(err){
			return;
		}
		connection.zremrangebyrank('nodejs',id,id,function(e,r){
			if(e){
				return;
			}
			connection.zadd('nodejs',list,aaa,function(error,result){
				if(err){
					return console.log(err);
				}
				res.redirect('/');
			});
		});
		
	});
});
//删除数据
app.get('/web_del/:id',function(req,res){
	var data=parseInt(req.params.id);
	connection.zremrangebyrank('nodejs',data,data,function(err,result){
		if(err){
			return console.log(err);
		}
		res.redirect('/');
	});
});
//创建服务器
var server=app.listen(8080,function(){
	var host=server.address().address;
	var port=server.address().port;
})