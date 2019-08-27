
//cms点击侧边栏时，下拉菜单的定位及active类名的改变。
function Sidebar_display(options) {
    this._init(options);
}
Sidebar_display.prototype = {
    '_init':function (options) {
        this.sidebar = options.sidebar;
    },
    'set': function (firstorder,secondorder) {
        this.sidebar.find('.active').removeClass('active');
        var first_order = this.sidebar.find('.treeview')[firstorder];
        $(first_order).addClass('active');
        $($(first_order).find('.treeview-menu li')[secondorder]).addClass('active');
    }
};
$(function () {
    sidebar_display = new Sidebar_display({'sidebar':$('.sidebar-menu')});
});