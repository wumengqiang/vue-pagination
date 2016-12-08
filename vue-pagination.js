/**
 * Created by wumengqiang on 16/12/8.
 *
 * @props
 *      itemNum   行的数量
 *      limit     每页有多少行, 可以和itemNum来确定一共有多少页
 *      pageNum   页数, 确定总页数有两种方法: 通过itemNum,limit来判定, 或者直接通过pageNum来进行赋值
 *      pageShow  分页组件显示多少页, 默认值为3
 *      curPage   当前页数,从1开始
 *      prevText  上一页按钮文本,默认为'<上一页'
 *      nextText  下一页按钮文本,默认为'下一页>'
 *      update    当页数改变时的回调函数
 *
 *
 *      使用方式  e.g.
 *              <pagination :item-num="waitPag.totalNum" :cur-page="waitPag.page" :limit="waitPag.limit" :pages-show="waitPag.maxPage"
 *                       @update="fetchRequirementList"></pagination>
 *
 */


Vue.component('pagination',{
	props:['itemNum', 'limit', 'pageNum', 'curPage', 'update', 'pagesShow',  'prevText', 'nextText'],
	template:
			'<div class="pagination-sm"> \
				<li class="pagination-prev" :class="{\'disable\' : data.curPage === 1}" @click="pageUpdate(data.curPage - 1)">{{data.prevText}}</li>\
				<li class="pagination-item"    @click="pageUpdate(item)"\
					 v-for="item in pageList" :class="{\'disable\': item === \'...\', \'active\': item == data.curPage}">{{item}}</li>\
				<li class="pagination-next" :class="{\'disable\' : data.curPage === data.pageNum}" @click="pageUpdate(data.curPage + 1)">{{data.nextText}}</li>\
				\
			</div>\
			',
	data: function(){
		var defaultValue = {
			prevText: '<上一页',
			nextText: '下一页>',
			pageShow: 3,

		};
		return {
			defaultValue: defaultValue,
			data: {}
		}
	},
	created: function(){
		this.updateBasicInfo();
		this.formatPageList();
	},

	beforeUpdate: function(){
		this.updateBasicInfo();
		this.formatPageList();
	},
	methods: {
		pageUpdate: function(page){

			console.log(typeof page);
			if(typeof page !== 'number' || page <= 0 || page > this.data.pageNum || page === this.curPage){
				return;
			}

			this.data.curPage = page;

			this.formatPageList();

			// callback
			this.$emit('update', this.data.curPage );
			this.$forceUpdate();
		},

		// 分页信息更新
		updateBasicInfo: function(){
			if(this.pageNum){
				this.data.pageNum = parseInt(this.pageNum);
			} else if(this.itemNum && this.limit){
				this.data.pageNum = Math.ceil(this.itemNum / this.limit) || 1;
			} else {
				this.data.pageNum = 1;
			}
			this.data.curPage = this.curPage > 0 ? this.curPage : 1;
			this.data.prevText = this.prevText || this.defaultValue.prevText;
			this.data.nextText = this.nextText || this.defaultValue.nextText;
			this.data.pageShow = this.pageShow || this.defaultValue.pageShow;
		},

		// 得到一个显示哪些页数的页数数组
		formatPageList: function(){
			if(! this.data.pageNum || this.data.pageNum < 1){
				return;
			}

			this.pageList = [];

			// 这种情况不出现省略号 ...
			if(this.data.pageShow + 3 >= this.data.pageNum){
				for(var i = 1; i <= this.data.pageNum; i++){
					this.pageList.push(i);
				}
				return this.pageList;
			} else{
				this.pageList.push(1);

				var start, end, secondPos, lastSecondPos;
				if(this.data.curPage <= 3){
					secondPos = 2;
					lastSecondPos = '...';
					start = 3;
					end = start + this.data.pageShow - 1;
				} else if(this.data.curPage + 2 >= this.data.pageNum){
					secondPos = '...';
					lastSecondPos = this.data.pageNum - 1;
					end = this.data.pageNum - 2;
					start = end - this.data.pageShow + 1;

				} else{
					secondPos = lastSecondPos = '...';
					start = this.data.curPage - Math.ceil(this.data.pageShow / 2 -1);
					end = start + this.data.pageShow - 1;
				}

				this.pageList.push(secondPos);
				for(var i = start; i <= end; i++){
					this.pageList.push(i);
				}

				this.pageList.push(lastSecondPos);
				this.pageList.push(this.data.pageNum);
				return this.pageList;
			}
		}
	}

});