$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //美化时间
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    //获取文章列表数据
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败! ');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    //初始化文章分类的方法

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章')
                } var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //让layui重新渲染
                form.render();
            }
        })
    }
    //筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取输入框的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用分页方法
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页触发该函数
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('body').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败! ');
                    }
                    layer.msg('删除文章成功! ');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })
}) 