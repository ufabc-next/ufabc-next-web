<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
  <div></div>
</template>

<style scoped lang="css">
.home-image {
  border-radius: 10px;
  -webkit-box-shadow: 0 9px 68px 0 rgba(62, 57, 107, 0.2);
  box-shadow: 0 9px 68px 0 rgba(62, 57, 107, 0.2);
  margin-bottom: 20px;
}
.registration-image {
  border-radius: 12px;
  -webkit-box-shadow: 0 9px 68px 0 rgba(62, 57, 107, 0.2);
  box-shadow: 0 9px 68px 0 rgba(62, 57, 107, 0.2);
}
.facebook-button {
  background-color: #4267b2;
  box-shadow: none;
  color: #fff !important;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  margin-bottom: 12px;
  padding: 18px 22px 16px 60px;
  position: relative;
  transition: all 0.3s;
  width: 263px;
  cursor: pointer;
  font-family: Montserrat;
  text-decoration: none !important;
  display: inline-block;
}
.facebook-button > i {
  position: absolute;
  top: calc(50% - 0.5em);
  font-size: 24px;
  left: 23px;
}
.google-button {
  background-color: white;
  box-shadow: 1px 1px 1px 2px #d2d2d0;
  color: #777777 !important;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  margin-bottom: 12px;
  padding: 18px 22px 16px 60px;
  position: relative;
  transition: all 0.3s;
  width: 263px;
  cursor: pointer;
  display: inline-block;
  font-family: Montserrat;
  text-decoration: none !important;
}
.google-button > img {
  left: 13px;
  position: absolute;
  top: calc(50% - 1em);
  width: 32px;
  margin-top: 0px !important;
}
.google-button:hover,
.facebook-button:hover {
  transform: scale(1.05, 1.05);
}
.recovery-button {
  background-color: #777777 !important;
  box-shadow: 1px 1px 1px 2px #868686;
  color: #fff !important;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  height: 56px;
  margin-bottom: 6px;
  padding: 18px 22px 16px 60px;
  position: relative;
  transition: all 0.3s;
  width: 263px;
  cursor: pointer;
  display: inline-block;
  font-family: Montserrat;
  text-decoration: none !important;
}
.recovery-button > img {
  left: 13px;
  position: absolute;
  width: 32px;
  margin-top: -16px !important;
  top: 50%;
}
.recovery-button:hover,
.facebook-button:hover {
  transform: scale(1.05, 1.05);
}
.chromestore-download {
  max-height: 64px;
  background: #fff;
  border-radius: 4px;
  padding: 4px;
  transition: background 0.5s;
  cursor: pointer;
}
.chromestore-download:hover {
  background-color: #f7f2f2;
}
.store-button {
  height: 64px;
  cursor: pointer;
}
.extension-link {
  color: #0000ff !important;
  cursor: pointer;
}
.navbar.past-main > .container > .logo-normal {
  display: block !important;
}
.navbar.past-main > .container > .logo-white {
  display: none;
}
@media only screen and (max-width: 768px) {
  .navbar-nav {
    padding-bottom: 1.5rem;
    background: rgba(255, 255, 255, 0.99) !important;
  }
  .navbar-light .navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(250, 250, 250, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  }
  .navbar.past-main .navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(46, 126, 237, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  }
}
.cta-big {
  background-image: url('assets/images/concepts.png');
}
h1.thanks {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  margin-top: 40px;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
}
@media only screen and (min-width: 240px) {
  .review-single {
    text-align: center;
    padding: 50px 0 50px 0;
  }
}
.coming-soon {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #ccc;
  border: 4px dashed #c1c1c1;
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 700;
  color: #364655;
  line-height: 1.2;
  letter-spacing: -1px;
}
</style>
