<?php
// Use php to load the news feed and sponsors

if(!$ajaxNavRequest) {
  if(!isset($_GET['waiver'])) {
?>
    <!-- Footer -->
    <div id="footer" style="display:none">
        <div class="container">
            <div class="row">
                <div class="4u">
                    <section>
                        <h2><a href="news" class="ncslFooterLink">News</a></h2>
                        <ul class="default">
                            <li><a href="news?archive=2&article=1">Pellentesque lectus gravida blandit</a></li>
                            <li><a href="#">Lorem ipsum consectetuer adipiscing</a></li>
                            <li><a href="#">Phasellus nibh pellentesque congue</a></li>
                            <li><a href="#">Cras vitae metus aliquam pharetra</a></li>
                            <li><a href="#">Maecenas vitae orci feugiat eleifend</a></li>
                        </ul>
                    </section>
                </div>
                <div class="4u">
                    <section>
                        <h2>Sponsors</h2>
                        <ul class="default">
                            <li><a href="#">Sponsor 1</a></li>
                            <li><a href="#">Sponsor 2</a></li>
                            <li><a href="#">Sponsor 3</a></li>
                            <li><a href="#">Sponsor 4</a></li>
                            <li><a href="#">Sponsor 5</a></li>
                        </ul>
                    </section>
                </div>
                <div class="4u">
                    <section>
                        <h2>Contact</h2>
                        <ul class="default">
                            <li>Email: <a href="#">something@something.com</a></li>
                            <li>Phone: (xxx) xxx-xxxx</li>
                            <li>Social: </li>
                        </ul>
                        <!-- Social Icons -->
                        <ul class="icons">
                            <li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
                            <li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
                            <li><a href="#" class="icon fa-youtube"><span class="label">Youtube</span></a></li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
  <?php }?> 
    <!-- Copyright -->
    <div id="copyright">
        <div class="container">&copy; 2016 Northside Christian Softball League</div>
    </div>
    
    <!-- Google Maps -->
    <script>function mapLoaded(){}</script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBwKDFXAxINOWM2OpsDbgoMj0dfrq5YTyY&callback=mapLoaded" type="text/javascript" async defer></script>
</body>
</html>
<?php }?>