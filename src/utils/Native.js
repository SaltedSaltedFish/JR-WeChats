


class Native {
    constructor(){

        this.showWaiting = _ => {
            if(window.plus){
                plus.nativeUI.showWaiting();
            }
        };

        this.closeWaiting = _ => {
            if(window.plus){
                plus.nativeUI.closeWaiting();
            }
        };

        this.alert = _ => {
            if(window.plus){
                plus.nativeUI.alert(_,null,'','OK');
            }
        };
    };

	downloader(url,options,fn){
		if ( window.plus) {
			let dtask = plus.downloader.createDownload(url,options,(d,status)=>{
				if ( status == 200 ) {
					//alert( "Download success: " + d.filename );
					plus.gallery.save(d.url,function (success){
						//alert(JSON.stringify(success));
						plus.nativeUI.alert('保存成功请在相册查看!');
					},function(error){
						plus.nativeUI.alert(JSON.stringify(error));
					})
				} else {
					plus.nativeUI.alert( "Download failed: " + status );
				};
			});

			dtask.start();
		}
	};
};

Native = new Native();
export default Native;