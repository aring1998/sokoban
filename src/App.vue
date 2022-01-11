<script>
	export default {
		onLaunch() {
			if (uni.getStorageSync('token')) this.$store.dispatch('token')
			this.$music.bgmPlay(this.$store.state.bgmPlay)
		},
		onShow() {

		},
		onHide() {

		}
	}
</script>

<style lang="scss">
@import './static/styles/index.scss';
</style>
