$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var idnexAdd = null;
    $('#btnAddCate').on('click', function () {
        idnexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 这里是有未来创建的元素所以要事件代理
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败! ');
                }
                initArtCateList();
            }
        })
    })
    var idnexEdit = null;
    $('body').on('click', '.btn-edit', function () {
        idnexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败! ');
                } layer.msg('更新分类数据成功! ');
                layer.close(idnexEdit);
                initArtCateList();
            }
        })
    })
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    } layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })


        });
    })
})