(function () {
    var $P='mx.controls';
    var FlexSprite=$import('html.display.FlexSprite');

    (function (_) {
        _.setAttribute('type','text/css');
        _.innerHTML='.Grid{margin:0 0 3em;line-height:1.5em;min-height:10em;height:100%;}\n' +
            '        .Grid .scroll{height:100%;border:0.1em solid #ddd;border-top:0;overflow-y:auto;overflow:auto;}\n' +
            '        .Grid table{width:100%;table-layout:fixed;border-collapse:collapse;border-spacing:0;}\n' +
            '        .Grid th,.Grid td{padding:0.2em;border:0.1em solid #ddd;}\n' +//width:100px;
            '        .Grid th{font-weight:bold;background:#eee;}\n' +
            // '        .Grid tbody tr td{white-space: nowrap;position: relative;display:block;}\n' +
            '        .Grid thead th:last-child,.Grid tbody td:last-child{width:auto;}\n' +
            '        .Grid tbody tr:nth-child(2n){background:#fafafa;}\n' +
            '        .Grid tbody tr:first-child td{border-top:0;}\n' +
            // '        .Grid tbody tr:first-child td,.Grid thead:first-child th{width:20em;}\n' +
            // '        .Grid tbody tr:last-child td{border-bottom:1px;}\n' +
            '        .Grid tbody tr td:first-child{border-left:0;}\n' +
            '        .Grid tbody tr td:last-child{border-right:0;}\n' +
            '        .Grid .GridRowRenderer[selected]{background-color: #c3e3f3;}\n' +
            '        .Grid .GridRowRenderer[highLine]{background-color: #e3eeff;}\n' +
            '        .Grid .GridItemRenderer .content {display:inline-block;}\n'+
            '        .Grid .GridItemRenderer .GridItemIconRenderer{background-repeat: no-repeat;background-size: contain;width:1em; height: 1em;margin: 0em 0.5em 0em 0.5em;padding: 0;display:inline-block;}\n' +
            '        .Grid .GridItemRenderer .GridItemIconRenderer[icon="root"]{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBENzk3NjRBRkUyMTFFN0ExQTRERDA5ODM0NDg1OTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBENzk3NjVBRkUyMTFFN0ExQTRERDA5ODM0NDg1OTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMEQ3OTc2MkFGRTIxMUU3QTFBNEREMDk4MzQ0ODU5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMEQ3OTc2M0FGRTIxMUU3QTFBNEREMDk4MzQ0ODU5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps4RNBsAAATASURBVHja7J1vaBtlHMe/z3OXS9JmSePadaWjTvyDtbRoYVD8tyG+EIabf1oVNsqGyvbCTYeiRYe6OZQJ60R8MUFEGZk6aUVB59gQfVPUbooMtBvIOja3DtpuSZs2ueTufC7pWrt1Kkqaa/P9wNHLpe09eT73e57nd4T7CcdxQLyDZBdQCKEQCiEUQiGEQiiEzDJ6KpW64qBlA2OmsiWAcBDw6TDgFFieOldiDCmfpnZFCQupr6+ffOEm7ck0UBkCHmnBvStvxeqGWjT7DFQrIXpBW2IAh3rw/pYYtguZvxhKkSs+9sPLcOeLq/B681LcBfeuStY1NdNvFkbKm59h2wtdeLVUI0SbnExUh+9ai8271yNWU4HrpomQEz8Lvanz3XEbVkR9kF8fw7clLWTXY9i0pRVvY0wds4rYInUhtDRhedSAKEUpOSGty9DS+QT2I6liwQs3f10pjaUZKVqZAS22EbFFESwtamRcLVJ8pRUp2pPLsXLdPehAxoOty0tZUUpStN1rsKOuCg2wPdrCKSklMXxp765Hp7QR9mwLnck5pSSGL12XWDzjRG7/JVMpZpZ26dQp4OmH8Ip6LbZ2Y2fW8mxMXxXLclKZf5inhfPBZTrsibyjvBwILwACfhVH+uwkhv9GjmrKmfM4bdlzTIhqe9q0L/adSh87/EPyy9iBkS+GR+yxvxfifsRQEKhepISUqXdl/n6Kl74IISYW63P11opP5C740yfTfZ0fDm5/65P4RzMLcWVURoGa6rwI2wYpIIbq4wDwaffwO4+/dn7zyHj+qtenyaitUfsOZcwGpupjlWq0tS18yq/D92DHwEa322VORnkwHxm2x4an+Y7b1RcsrFp9zYaO9sg65KZvdyyurlJ7kjKKxZiD59ur3lhSpVVKhEP5CdziMFU0Mg4i1cbiTW2RdolIZA4vWeaXlPvvDrcKp+cGBz4fhysPYFt2QkLXKMMjSF2GJYcrb626+DUgr0UJu4BCCIVQCKEQCiEUQiGEQiiEUAihEAohFEIhhEIohFAIhRAKIRRCIYRCKIRQCIUQCqEQQiGEQiiEUAiFEAqhEEIhFEIohFAIhRAKoRBCIRRCKIRCCIUQCvG0EAE+jtQrCDjSgTPInvCEDFgWEvKXE+aR3APiSXHRBE6dNY/Lrm8S+6ZqtZGi4Rc4fGT0c7EwogV/2rv0+7o6owkmHxdbrOhIpe0LzWv6G+VQ3BrfuXd4K4JccBWNBRLvdQ/v+O1k+o/cYHW0L3WiYYkvdEtz+e1IcdE1q4Q19PaOdre/PPCsmXGcnBD3wdYHepKHlJSKmxuDLbl6hvRS8GHKlfFj72hX63Nn2wcvWmbu8KX3lR18fDBxMDNu/t50k7+5PKpV5KzkaorYbi0e5AtecPtPm3vVu33oltAJCCST2aE9scFta18698xQwp6sIikCgcCkNLfCi2nauPFaI7qhreLR+1pCD1xfazQEDBFV/5Nrsf+Z9GWyTrx/IHP8u5+TX+3ZH9939NfxM7pKOXRtKu0Q/f390/7OFWlmHaTTNkJlEjVVeijglxUFr6c+/7FdIecGs/H4qAVDF/AbEuKyFFA4rIzgKbjWpRBCIRRCKIRCCIVQCJlt/hRgACbgyHgiIHJeAAAAAElFTkSuQmCC")}\n' +
            '        .Grid .GridItemRenderer .GridItemIconRenderer[icon="open"]{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEM3NjgzQTRBRkUzMTFFN0I0MjRFQzYwRjFBNjkxQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEM3NjgzQTVBRkUzMTFFN0I0MjRFQzYwRjFBNjkxQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowQzc2ODNBMkFGRTMxMUU3QjQyNEVDNjBGMUE2OTFCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowQzc2ODNBM0FGRTMxMUU3QjQyNEVDNjBGMUE2OTFCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqMk8zkAAAdESURBVHja7J1pbBRl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")}\n' +
            '        .Grid .GridItemRenderer .GridItemIconRenderer[icon="file"]{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkU0QkE3MTRBRkUyMTFFNzhENTA5QzM3MDg5REUxNUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkU0QkE3MTVBRkUyMTFFNzhENTA5QzM3MDg5REUxNUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRTRCQTcxMkFGRTIxMUU3OEQ1MDlDMzcwODlERTE1QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTRCQTcxM0FGRTIxMUU3OEQ1MDlDMzcwODlERTE1QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtImnmMAAAWdSURBVHja7J3LbxtVFMbPnRnbMR6nTdJEUYNUHkUKTaCNQjcgEPv+AbCCBSyoVFQQREViU6GiFhK1wREV7FjBAokViA0SUIQqNZOENI2hkLQRhDpxHk3jV2J75nLvtUNTaNXM2E39+L7I1szInozPb75z7pkZ6TLOOXmV4zj+2Hz8yPzCUl8qnW4X60Ted7d9Yoyyuayzq6XpWE9310AlHZrh9YvL11een57580QikXqGMyJN/MhqEZMnDdO1Cxcn3tc0bX3/vseHxInpZ4zl6D6fUp6AzF6LvfH71NV+4QdD1zSqHhQ3pTH15v9+eDgilnQBZVBiqjqHxBeXXvht6soZxjTSWTWiKIZd+EAev67r9IM1fEZuLkKpHiC5XK71j+mZIUZaVaWo24kXXzqT2UtAGa4MKJqbD8fmF15OZzKtmlbdMP4r5RTDUFDGo78eqRaHmAuLS6+QrtUUDL65pggoP1rDQ3JVOCVS0UCy2exjwh2dOtWWO251inxT6eujYvqKVCyQvG1zW/QZjNUukI30RYX0JaFwOSSuzJTFqeZ1a/pSTokUnbJtUDSC7lLorYgo9IcrvlOvB7foN51yViw5wimfwiEVAEUvQPlkO4bEAOKuTxkaj0bfBJAK6Og1BUU6xTo9NjnZByAVgEYvQjlnjXw4Ojl5AkDKKObRLTrTRJti0E8jI++OTUbfAZD77hOu+hR5lficZZ0cvTR5DMPeMhQG2ZCXctVBpi+mnDJ6Su6mp6vrAzikBCKappPf51NnvNdCz4pDYlFTTokh8VEAKWHkJL1hBkPES7wktKlPGSwHlLqtIfLhjsZQiAI+P/ESqWzqUwZFoX8LQDzIET7x6Qa1NbUoIE6JfYr+b/qyBkppHut32MvVY0zUZIaptblFrniqJ7d1imWd/iUafR2jLC9nuADRvrNFuSW+vEg521ajL/XHtn7XYaMuqUv3urzzaEW4wwNun/sCkCKUXeEdZDYE6XpilRKZNOXyOde1ZfP9FC77lBGrX2xr6+na956AnAQQF5J3QwO6j9qbW6nVsYVT8uTYHitL4Uk8sU8uHwzp63x07YsHgsExAPFQ6AUFVVgDhk80fqW6T6Y9Tm6sBiB3Sj2cl3zXWl1mwSirugUgAAIBCIBAAAIgEIAACAQgAAIBCAQgAAIBCIBAAAIgEIAACAQgEIAACAQgAAIBCIBAAAIgEIBAAAIgEIAACAQgAAIBCIBAAAIBCIBAAAIgEIAACAQgAAIBCAQgAAIBCIBAAAIgEIAACAQgtSoGIBUofs+AcAS3klJW3nbUBCiQu6TlcE62i1kWtgzEdvK0lsvW/AT3ZcUhYiVjlrfz5QfiOJwSqRSAuNRqKqlcUnYgmqbRSipB6fU1tQzdPV6Z7BqtJBOu4rXlTxYmYSSKLcbJ5o6aPRm6Q1BFbGS9vSZiJTOKiJ1ediDBhuD0znB4JpFO0ez8HOXFP9QF+brHwgr9xsZLxkTG5q/4HCXSadphmksidrNb3Z2xdQuyxEO7O76MxRf6bmRSlI3NUltzC4WDITVdnLQPL6UjqgEotqgVK+kkxZeXRLpaJy4yyZ6O3V+J2M1veVduZiJLJFOPfP7N1+PZXM4sTC0nnBNooFAwSAFfQOVKlcl4XbFQE4qtCwDJtYyqsaprEzEI+IyVFw8d6mk0zZmyO0QqbIauPH3gwPHvzp8f8Pv96mAy4gDS4kA2hnl12YwXT2r5+1X9EMtZMdx9rre33w0M1w7Z0M/WyNkLlyYO+wwDI67/tQcO5fN56u3u+uzZpw6+Jjat33MgUhOXL789fHGibzWdapOTvet1DkamLTnvoUjf2YNPPnF8f2fnSU8psJSZkkVNeTg6NfXq1b9nX7qRTD5o23ZdwjB0gxrN0Nyejo5vu/fu/ThsmiNe9/WPAAMAJEonzjnbw84AAAAASUVORK5CYII=")}\n' +
            '        .Grid .GridColumnRenderer {text-align:left}\n'+
            '        .Grid .GridColumnRenderer .content{width:auto;text-align:center;}\n'+
            '        .Grid .GridColumnRenderer .button[icon="asc"]{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDk2RDM2MjNCMjNFMTFFNzkwRUFGM0M4RkE2OUJCQjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDk2RDM2MjRCMjNFMTFFNzkwRUFGM0M4RkE2OUJCQjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OTZEMzYyMUIyM0UxMUU3OTBFQUYzQzhGQTY5QkJCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0OTZEMzYyMkIyM0UxMUU3OTBFQUYzQzhGQTY5QkJCNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk/0mrIAAAJqSURBVHja7Jq9axRBGIdns+odfqAJAfEPsEgjxkrSpLSwsIn/gDljYWEjBBKiOb/g7gQ7MYWQ/tJcLSZKDoMgIqSNtYVIQkLix+X2/A07gqzc7s7OzO3M+r7wQMJl38nDzsx78+ExxhqgArrgkJmNHiiBAFwHawq5amAGvAR3ZR78IP6RQXNHQfZhJFdD5uFXOQnfzCj7qE++hu3CFQ1vNkqtSMLVlHmfFEG4Kpk79k2/zUn4tuKYTeJpv4TrOQnfSCG7oNjGP93bA5fAFCgPqA4fA3vgGdhOkH2goc06mGWWx6Lm3lS3VZT3uHuGhtBjkd+quGh43pg7YpnwV7ACRkAn8tkBmABnY57fAW/AUfC3G/99F2wwx6KZ8AbbSQmGHBNO6pF+0YSHVH3SjOFT4KemGe5PHd4XP1vVRUbBMhgD3zUKl8QEMg0+2SR8Hlw12PZkHsJxfT4w3PaBbZOAaeGebcKFDBKWKeKK4dsm/Mtw20EewnFlaRPMg8viS7muOnwCfAMt24Q7LMUOIE1aJEzCJEzCJEzCRupwXFwD91l4UtGVfLYsNgD4UctnV4RvgXHFtq+A5650aR2L90OXxrCOL/6BS8I0SxddWMfi3XdJ+GSOFSKXRpfEYt7PUIf5SR4/eXjNKBKjxeJPD9/TpEXCJEzCJEzC/8EGQL84w8KL2ufEEjJ6WtETGwD8JINfB/ziujC/R5X2WvA78ML1Li2zIPCKMIZldjE6NGmRsP3CnuEx7Knm1C1clvjb4xnyn074fHjQZekj2GLhLb4fMXWYbwC0M+RfBRdYeBUy+uL4xkIzKcFvAQYARdK4pYikei8AAAAASUVORK5CYII=");}\n'+
            '        .Grid .GridColumnRenderer .button[icon="des"]{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEU3MDc5QzNCMjNFMTFFN0FDMjdGQjJDRTAwNEM1MjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEU3MDc5QzRCMjNFMTFFN0FDMjdGQjJDRTAwNEM1MjkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0RTcwNzlDMUIyM0UxMUU3QUMyN0ZCMkNFMDA0QzUyOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0RTcwNzlDMkIyM0UxMUU3QUMyN0ZCMkNFMDA0QzUyOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjslQikAAAJrSURBVHja7Ju/SwMxFMdTf2JFUQRnR0dRJxcVZxf/AAe1k+CPQQfBX7QW2voP6N8gQkdxEBVEQURcHMRNqQpaxB/Y+qO+0CiltneXXO6SO9+D79Dm7iWfS/NeLkkJMbcoKA26A90UiX6/SPitC3TF7k+V8JtiZRegNuKy0UpzBtoV8Dlp4rNQQzJhKixckzYpfxSo95Xj2je3gXM2y+3ek3Mb2FeGwC5ZNce1VX4A5hmXnzIrrlIEnAT1gJpYFA6UeCBBlo8P/ABMQYYxaCEwAiMwAiPwPwdWlYfbQXFQPeid895KNvtaB216BXgANGjTR0AEWNVP+kOCj2cvjeFPVT4wSiOwvvVWeAlYRnYIeikPb4H2QI2Efxm2krV7zUvAl6BeDFoIjMAIjMAIjAsASqwVFAG1gF7I350HEaO7FXQn4xCUEFhY+LUjYrxDnxTwGSLWTwCIqNOPLw9GVuPHBQAh/xilEdgZC6jiUgUcVAWsKg/Tw2wnbAEgIzEP14HOSf4wnVbAp6Bukt95yEoErgU96TjT+mngs2SfWRlB68tmueeitNkk4cNLwHTs9IMmWAB5LwKhn/vYpLyc3ZL80aLiyEsPnz2ApkDXOkHPOTyR79Cxl1ccgl1wYZIhbHHJsEu6juFCi4FmJfilPRs2KG8GTYMaJOZhs/RLdzg2ShVGbfbsvIUGjDgcN8ppv1yDVgUdRiw+8XFFwIb/z4hxOlvm+ImNKQLeNmtY1AFYrYGt9HRYIIhoDUwtYXPMFltId+BS0GEbaWJSEfAxz+vhDMuXoyR/Cm7eBvAZ6J69vGRcysP05MDOtwADAJOD5XIm7NvnAAAAAElFTkSuQmCC");}\n'+
            '        .Grid .GridColumnRenderer .button{display:inline-block;background-repeat: no-repeat;background-size: contain;width:1em; height: 1em;margin: 0em 0.3em 0em 0.3em;}\n'+
            '        .Grid .GridColumnRenderer .serial{display:inline-block;background-repeat: no-repeat;background-size: contain;width:1em; height: 1em;margin: 0em 0.3em 0em 0em;font-size:0.6em;}\n' +
            '        /* 滚动条 */\n' +
            '        .Grid ::-webkit-scrollbar-thumb:horizontal { /*水平滚动条的样式*/\n' +
            '            width: 0.5em;\n' +
            '            background-color: #CCCCCC;\n' +
            '            -webkit-border-radius: 0.3em;\n' +
            '        }\n' +
            '        .Grid ::-webkit-scrollbar-track-piece {\n' +
            '            background-color: #fff; /*滚动条的背景颜色*/\n' +
            '            -webkit-border-radius: 0; /*滚动条的圆角宽度*/\n' +
            '        }\n' +
            '        .Grid ::-webkit-scrollbar {\n' +
            '            width: 0.6em; /*滚动条的宽度*/\n' +
            '            height: 0.5 em; /*滚动条的高度*/\n' +
            '        }\n' +
            '        .Grid ::-webkit-scrollbar-thumb:vertical { /*垂直滚动条的样式*/\n' +
            '            height: 5 em;\n' +
            '            background-color: #999;\n' +
            '            -webkit-border-radius: 0.3em;\n' +
            '            outline: 0.1 em solid #fff;\n' +
            '            outline-offset: -0.2 em;\n' +
            '            border: 0.1 em solid #fff;\n' +
            '        }\n' +
            '        .Grid ::-webkit-scrollbar-thumb:hover { /*滚动条的hover样式*/\n' +
            '            height: 5 em;\n' +
            '            background-color: #9f9f9f;\n' +
            '            -webkit-border-radius: 0.5 em;\n' +
            '        }';

        document.head.appendChild(_);
    })(document.createElement('style'));


    $package($P)
        .import(FlexSprite=$import('html.display.FlexSprite'))
        .class('Grid')
        .static({
            create:function (tag) {
                return document.createElement(tag);
            },
        })
        .extends('html.display.FlexSprite')(
            function () {
                $super(document.createElement('div'));

                var thead=document.createElement('table');
                this.headInstance=new FlexSprite(document.createElement('thead'));
                thead.appendChild(this.headInstance.htmlElementInstance);
                $this.addElement(thead);

                var scroll=document.createElement('div');
                scroll.setAttribute('class','scroll');
                var tbody=document.createElement('table');
                this.bodyInstance=new FlexSprite(document.createElement('tbody'));
                tbody.appendChild(this.bodyInstance.htmlElementInstance);
                scroll.appendChild(tbody);

                $this.addElement(scroll);
            },
            {
                headInstance:null,
                bodyInstance:null,
                get width(){
                    return(this.htmlElementInstance.clientWidth)
                },
                set width(newVal){
                    if(this.width!==newVal)this.htmlElementInstance.width=newVal;
                },
                get height(){
                    return(this.htmlElementInstance.clientHeight)
                },
                set height(newVal){
                    if(this.height!==newVal)this.htmlElementInstance.height=newVal;
                },

                _columns:null,
                get columns(){
                    return this._columns;
                },

                set columns(newVal){
                    if(this.columns!==newVal){
                        this._columns=newVal;

                        if($this.headInstance.children.length>newVal.length)while($this.headInstance.children.length!==newVal.length){
                            $this.headInstance.removeElementAt($this.headInstance.children.length-1);
                        };

                        var w=newVal.reduce(function (a,b) {
                            return a+b.width;
                        },0);

                        newVal.forEach(function (item,k) {
                            var h=this.getElementAt(k);
                            if(!h){
                                h=new (item.headerRenderer)();
                                this.addElement(h);
                            };

                            item.percentWidth=Math.round(item.width/w*10000)/100;
                            h.htmlElementInstance.style.width=item.percentWidth+'%';
                            h.grid=$this;
                            h.columnIndex=k;
                            h.data=item;
                        },$this.headInstance);
                        $this.headInstance.commitProperties();
                    };
                },

                _dataProvider:null,
                get dataProvider(){
                    return this._dataProvider;
                },
                set dataProvider(newVal){
                    if(newVal!==this.dataProvider){
                        this._dataProvider=newVal;
                        $this.headInstance.children.forEach(function (h) {
                            h.reset();
                        });
                        this.refresh();
                    };
                },
                refresh:function () {
                    var newVal=$this.dataProvider;

                    if($this.bodyInstance.children.length>newVal.length)while($this.bodyInstance.children.length!==newVal.length){
                        $this.bodyInstance.removeElementAt($this.bodyInstance.children.length-1);
                    };

                    (newVal instanceof GroupingCollection?newVal.source:newVal).forEach(function (item,k) {
                        var r=$this.bodyInstance.getElementAt(k);
                        if(!r){
                            r=new GridRowRenderer();
                            $this.columns.forEach(function (col) {
                                var c=new col.itemRenderer();
                                c.htmlElementInstance.style.width=col.percentWidth+'%';
                                r.addElement(c);
                            });
                            $this.bodyInstance.addElement(r);
                        };
                        r.setData(item,$this);
                    });
                    $this.bodyInstance.commitProperties();

                    return true;
                },
            }
        );


    var GridRowRenderer=$package($P)
        .class('GridRowRenderer')
        .extends('html.display.FlexSprite')(
            function () {
                $super(document.createElement('tr'));
                $this.addEventListener('mouseover',function (event) {
                    this.setAttribute('highLine','true');
                }.bind($this.htmlElementInstance));
                $this.addEventListener('mouseout',function () {
                    this.removeAttribute('highLine');
                }.bind($this.htmlElementInstance));
                $this.addEventListener('click',function () {
                    if(this.grid.__ROW__LAST__CLICK__)this.grid.__ROW__LAST__CLICK__.htmlElementInstance.removeAttribute('selected');
                    this.grid.__ROW__LAST__CLICK__=this;
                    this.htmlElementInstance.setAttribute('selected','true');
                }.bind($this));
            },{
                icon:undefined,
                setData:function (data,grid,index) {
                    $this.children.forEach(function (c,k) {
                        c.grid=grid;
                        c.columnIndex=k;
                        c.rowIndex=index;
                        c.data=data;
                    });

                    $this.grid=grid;
                    $this.rowIndex=index;
                    $this.data=data;
                },
            }
        );

    var GridItemIconRenderer=$package($P)
        .class('GridItemIconRenderer')
        .extends('html.display.FlexSprite')(
            function () {
                $super(document.createElement('div'));
                $this.addEventListener('click',$this.clickHandler.bind(this));
            },
            {
                root:function () {
                    $this.htmlElementInstance.setAttribute('icon','root');
                },
                open:function () {
                    $this.htmlElementInstance.setAttribute('icon','open');
                },
                file:function () {
                    $this.htmlElementInstance.setAttribute('icon','file');
                },
                grid:undefined,
                data:undefined,
                clickHandler:function () {
                    if($this.grid.dataProvider.hasExpand($this.data)===true){
                        $this.grid.dataProvider.closeNode($this.data);
                        $this.root();
                        $this.grid.refresh();
                    }else if($this.grid.dataProvider.hasChildren($this.data)===true){
                        $this.grid.dataProvider.openNode($this.data);
                        $this.open();
                        $this.grid.refresh();
                    };
                },
                reset:function (grid,item) {
                    if(grid.dataProvider.hasChildren(item)){
                        grid.dataProvider.hasExpand(item)?$this.open():$this.root();
                    }else $this.file();
                    $this.htmlElementInstance.setAttribute('style','margin-left:'+(grid.dataProvider.getDeep(item)+0.5)+'em;');

                    if(this.grid!==grid)this.grid=grid;
                    if(this.data!==item)this.data=item;
                },
            }
        );

    var GridItemRenderer=$package($P)
        .class('GridItemRenderer')
        .extends('html.display.FlexSprite')
        (
            function (htmlElement) {
                $super(htmlElement);
                $this.class.push('GridItemRenderer');
                this.addElement($this.content);
            },{
                _data:undefined,
                set data(nv){
                    if(this.data!==nv)this._data=nv;
                },
                get data(){
                    return this._data;
                },
                _inner:undefined,
                get content(){
                    if(this._inner===undefined){
                        this._inner=document.createElement('div');
                        $this._inner.setAttribute('class','content');
                    };

                    return this._inner;
                },
                _hasIcon:false,
                _icon:undefined,
                get icon(){
                    if(this._icon===undefined)this._icon=new GridItemIconRenderer();
                    return this._icon;
                },
                _grid:undefined,
                get grid(){
                    return this._grid;
                },
                set grid(nv){
                    if(this.grid!==nv)this._grid=nv;
                },
                columnIndex:-1,
                rowIndex:-1,
            }
        );



    var defaultGridItemRenderer=$package($P)
        .class('defaultGridItemRenderer')
        .extends(GridItemRenderer)(
            function () {
                $super(document.createElement('td'));
                $this.addEventListener('click',$this.clickHandler.bind($this));
            },{
                set data(nv){
                    if($this.data!==nv){
                        $super.data=nv;
                        var t=(function () {
                            return (this.labelFunction||this.defaultLabelFunction)(nv,this);
                        }).call($this.grid.columns[$this.columnIndex]);
                        this.content.innerText=t===undefined||t===null?'':t;
                        var _=($this.grid.dataProvider instanceof GroupingCollection) && $this.columnIndex===0;
                        if($this._hasIcon===false && _===true)$super.addElementAt($this.icon,0);
                        else if($this._hasIcon===true && _===false)$super.removeElementAt($this.icon,0);
                        if(_)$this.icon.reset($this.grid,nv);
                    };
                },
                get data(){
                    return $super.data;
                },
                clickHandler:function (event) {
                    var e=new Event('itemClick');
                    e.item=$this;
                    $this.grid.dispatchEvent(e);
                },
            }
        );

    var defaultGridColumnRenderer=$package($P)
        .class('defaultGridColumnRenderer')
        .extends(GridItemRenderer)(
            function () {
                $super(document.createElement('th'));
                $this.class.push('GridColumnRenderer');
                ['button','serial'].forEach(function (k) {
                    (function () {
                        $this.addElement(this);
                        this.setAttribute('class',k);
                    }).call($this['_'+k]=document.createElement('div'));
                });
                $this.addEventListener('click',$this.columnClickHandler.bind($this));
                $this._button.addEventListener('click',$this.buttonClickHandler.bind($this));
                $this._button.setAttribute('icon','asc');
            },{
                set data(nv){
                    if($this.data!==nv){
                        $super.data=nv;
                        $this.content.innerText=nv.headerText;

                    };
                },
                get data(){
                    return $super.data;
                },

                reset:function () {
                    if($this._serial.innerText)$this._serial.innerText='';
                    if($this._button.hasAttribute('icon'))$this._button.removeAttribute('icon');
                },

                _clickTimeStamp:-1,
                _serial:undefined,
                _button:undefined,
                columnClickHandler:function (event) {
                    if(event.target!==$this._button){
                        switch($this.data.sortDescending){
                            case undefined :
                                $this.data.sortDescending=true;
                                $this._button.setAttribute('icon','asc');
                                $this._clickTimeStamp=event.timeStamp;
                                break;
                            case true :
                                $this.data.sortDescending=false;
                                $this._button.setAttribute('icon','des');
                                $this._clickTimeStamp=event.timeStamp;
                                break;
                            case false :
                                $this.data.sortDescending=undefined;
                                $this.reset();
                                break;
                        };

                        $this.doSort();
                    };
                },
                buttonClickHandler:function (event) {
                    if($this.data.sortDescending){
                        $this.data.sortDescending=false;
                        $this._button.setAttribute('icon','des');
                    }else{
                        $this.data.sortDescending=true;
                        $this._button.setAttribute('icon','asc');
                    };
                    $this._clickTimeStamp=event.timeStamp;

                    $this.doSort();
                },
                doSort:function () {
                    $this.grid.dataProvider.doCompare(
                        $this.grid.dataProvider.source,
                        $this.grid.headInstance.children.filter(function (c) {
                            return c.data.sortDescending!==undefined;
                        }).sort(function (a,b) {
                            if(a._clickTimeStamp>b._clickTimeStamp)return 1;
                            else if(a._clickTimeStamp<b._clickTimeStamp)return -1;
                            else return 0;
                        }).map(function (c,k) {
                            c._serial.innerText=k+1;
                            return c.data;
                        })
                    );
                    $this.grid.refresh();
                },
            }
        );


    $package($P)
        .class('GridColumn')(
            function (columnName) {
                this.headerText=this.dataField=columnName;
//                            this._htmlElementInstance=document.createElement('th');
            }, {
//                            _htmlElementInstance:null,
                /*与列关联的数据提供程序项目中字段或属性的名称。*/
                dataField:'',
                /*显示列标题的项呈示器实例的类工厂。*/
                headerRenderer:defaultGridColumnRenderer,
                /*显示列中每个项目数据的项呈示器实例的类工厂。*/
                itemRenderer:defaultGridItemRenderer,
                /*此列的标题文本。*/
                headerText:null,
                /*确定此列中显示文本的函数。*/
                labelFunction:null,
                defaultLabelFunction:function (item, column) {
                    return item[column.dataField];
                },
                /*列的最小宽度，以像素为单位。*/
                minWidth:null,
                /*设置为 true 表示用户可以单击此列的标题以对数据提供程序排序。*/
                sortable:true,
                /*对列中的数据进行排序时调用的回调函数。*/
                sortCompareFunction:null,
                /*指示列排序是按升序排序（设置为 false），还是按降序排序（设置为 true）。*/
                sortDescending:undefined,
                /*如果为 true，则列可见。*/
                visible:true,
                /*列的宽度（以像素为单位）。*/
                _width:100,
                get width(){
                    return this._width;
                },
                set width(v){
                    if(v!==this.width){
                        this._width=v;
                    };
                },
            }
        );


})();