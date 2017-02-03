/**
 * Created by Administrator on 2017/1/16 0016.
 */

var  callkami= require('ui/module1.js');
var  callkami2= require('ui/module2.js');

function sss(){

    alert(222222);
}
import $ from 'jquery';
let app =document.createElement('div');
const myPromise = Promise.resolve(42);
myPromise.then((number) => {
    $('body').append('<p>23345promise result is ' + (++number) + ' now is ' + '</p>');
});
app.innerHTML = '<h1>Hello World it1002</h1>';
document.body.appendChild(app);