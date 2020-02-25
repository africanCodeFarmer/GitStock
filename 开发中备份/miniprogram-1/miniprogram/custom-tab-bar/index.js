Component({
	data: {
		active: 0,
		list: [
			{
				icon: 'balance-o',
				text: '花支',
				url: '/pages/spend/spend'
			},
			{
				icon: 'orders-o',
				text: '任务',
				url: '/pages/task/task'
			},
			{
				icon: 'home-o',
				text: '主页',
				url: '/pages/home/home'
			},
			{
				icon: 'balance-list-o',
				text: '花支日志',
				url: '/pages/spendLog/spendLog'
			},
			{
				icon: 'todo-list-o',
				text: '任务日志',
				url: '/pages/taskLog/taskLog'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},
		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
