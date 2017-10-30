---
title: Gallery
permalink: /gallery/
layout: default
---

<div class="container-fluid">
    <ul class="row portfolio list-unstyled mb-0 lightbox shuffle" id="grid" style="position: relative; overflow: hidden; height: 676.5px; transition: height 250ms ease-out;">
        {% for image in site.data.gallery %}
        <!-- project -->
        <li class="col-md-3 project shuffle-item filtered" style="position: absolute; top: 0px; left: 0px; visibility: visible; transition: transform 250ms ease-out, opacity 250ms ease-out;">
            <div class="effect effect-1 clearfix">
                <div class="img">
                    <img class="img-responsive" src="{{ image.url }}" alt="">
                    <div class="overlay">
                        <a href="{{image.url}}" class="image-lightbox expand">+</a>
                    </div><!-- / overlay -->
                </div><!-- / img -->
            </div><!-- / effect-1 -->
        </li><!-- / project -->
        {% endfor %}
    </ul> <!-- / portfolio -->
</div>
