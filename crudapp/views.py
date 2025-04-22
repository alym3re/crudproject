from django.shortcuts import render
from .models import Item
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    items = Item.objects.all().order_by('-id')
    return render(request, 'crudapp/index.html', {'items': items})
    

@csrf_exempt
def create_item(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        avatar_data = {
            'skin': request.POST.get('skin', 'skin1.png'),
            'eyebrow': request.POST.get('eyebrow', 'eyebrow1.png'),
            'eyes': request.POST.get('eyes', 'eye1.png'),
            'hair': request.POST.get('hair', 'hair1.png'),
            'hat': request.POST.get('hat', 'hat1.png'),
            'clothes': request.POST.get('clothes', 'clothes1.png'),
            'background': request.POST.get('background', 'background1.png')
        }
        
        item = Item(name=name, **avatar_data)
        item.save()
        
        return JsonResponse({
            'status': 'success', 
            'id': item.id, 
            'name': item.name,
            **avatar_data
        })

@csrf_exempt
def update_item(request, id):
    if request.method == 'POST':
        item = Item.objects.get(id=id)
        item.name = request.POST.get('name')
        item.skin = request.POST.get('skin', item.skin)
        item.eyebrow = request.POST.get('eyebrow', item.eyebrow)
        item.eyes = request.POST.get('eyes', item.eyes)
        item.hair = request.POST.get('hair', item.hair)
        item.hat = request.POST.get('hat', item.hat)
        item.clothes = request.POST.get('clothes', item.clothes)
        item.background = request.POST.get('background', item.background)
        item.save()
        
        return JsonResponse({
            'status': 'success', 
            'id': item.id, 
            'name': item.name,
            'skin': item.skin,
            'eyebrow': item.eyebrow,
            'eyes': item.eyes,
            'hair': item.hair,
            'hat': item.hat,
            'clothes': item.clothes,
            'background': item.background
        })

@csrf_exempt
def delete_item(request, id):
    if request.method == 'POST':
        item = Item.objects.get(id=id)
        item.delete()
        return JsonResponse({'status': 'success'})