$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //模板 
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //选择封面按钮点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 监听coverFile的变化事件
    $('#coverFile').on('change', function (e) {
        //获取文件的列表
        var files = e.target.files;
        //判断是否选择文件
        if (files.length === 0) {
            return;
        }
        //根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //定义文章的发布状态
    var art_state = '已发布'
    $('#btnSeve2').on('click', function () {
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求
                publishAticle(fd);
            })
    })
    function publishAticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败');
                }
                layer.msg('发表文章成功');
                location.href = '/article/art_listcx.html';
            }
        })
    }
})