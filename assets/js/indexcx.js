$(function () {
    getUserInfo()
    var layer = layui.layer;
    //点击按钮 实现退出
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('是否退出?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '/logincx.html';
            //关闭confirm询问框
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avater').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avater').html(first).show()
    }
}