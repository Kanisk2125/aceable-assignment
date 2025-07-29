# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework import status
# from .models import EventFile
# from .serializers import EventFileSerializer

# import os
# import time
# import tarfile
# import zipfile
# import csv
# from django.conf import settings

# # ---------- Upload API ----------
# class FileUploadView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, format=None):
#         serializer = EventFileSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "File uploaded successfully"}, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ---------- Search API ----------
# class SearchEventsView(APIView):
#     def post(self, request):
#         search_field = request.data.get('search_field')
#         search_value = request.data.get('search_value')
#         start_time_filter = request.data.get('start_time')  
#         end_time_filter = request.data.get('end_time')      

#         if not search_field or not search_value:
#             return Response({"error": "Please provide both search_field and search_value"}, status=400)

#         start = time.time()
#         results = []

#         fieldnames = [
#             "serialno", "version", "account-id", "interface-id", "srcaddr",
#             "dstaddr", "srcport", "dstport", "protocol", "packets", "bytes",
#             "starttime", "endtime", "action", "log-status"
#         ]

#         upload_dir = os.path.join(settings.MEDIA_ROOT, 'events')
#         for filename in os.listdir(upload_dir):
#             filepath = os.path.join(upload_dir, filename)
#             with open(filepath, 'r') as file:
#                 reader = csv.DictReader(file, fieldnames=fieldnames, delimiter=' ')
#                 for row in reader:
#                     try:
#                         clean_row = {}
#                         for k, v in row.items():
#                             if k is not None and v is not None:
#                                 clean_row[k.strip()] = v.strip()

#                         if 'interface-id' in clean_row:
#                             clean_row['instance-id'] = clean_row.pop('interface-id')


#                         if search_value.lower() not in clean_row.get(search_field, '').lower():
#                             continue

#                         try:
#                             event_start = int(clean_row.get('starttime', 0))
#                         except ValueError:
#                             continue

#                         if start_time_filter and int(start_time_filter) > event_start:
#                             continue
#                         if end_time_filter and int(end_time_filter) < event_start:
#                             continue

#                         results.append({
#                             "event": clean_row,
#                             "file": filename
#                         })

#                     except Exception as e:
#                         print(f"ERROR while parsing row: {e}")
#                         continue

#         total_time = round(time.time() - start, 3)

#         return Response({
#             "search_time_seconds": total_time,
#             "total_found": len(results),
#             "results": results
#         })
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import EventFile
from .serializers import EventFileSerializer

import os
import time
import tarfile
import zipfile
import csv
from django.conf import settings

# ---------- Upload API ----------
class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        file_obj = request.FILES.get("file", None)
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        upload_dir = os.path.join(settings.MEDIA_ROOT, 'events')
        os.makedirs(upload_dir, exist_ok=True)

        # Save uploaded file temporarily
        temp_path = os.path.join(upload_dir, file_obj.name)
        with open(temp_path, 'wb+') as temp_file:
            for chunk in file_obj.chunks():
                temp_file.write(chunk)

        # Extract if compressed
        try:
            if tarfile.is_tarfile(temp_path):
                with tarfile.open(temp_path, "r:gz") as tar:
                    tar.extractall(path=upload_dir)
                os.remove(temp_path)

            elif zipfile.is_zipfile(temp_path):
                with zipfile.ZipFile(temp_path, 'r') as zip_ref:
                    zip_ref.extractall(upload_dir)
                os.remove(temp_path)
            else:
                # If it's a regular file, just keep it
                pass

        except Exception as e:
            return Response({"error": f"File extraction failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "File/folder uploaded and processed successfully"}, status=status.HTTP_201_CREATED)


# ---------- Search API ----------
class SearchEventsView(APIView):
    def post(self, request):
        search_field = request.data.get('search_field')
        search_value = request.data.get('search_value')
        start_time_filter = request.data.get('start_time')  
        end_time_filter = request.data.get('end_time')      

        start = time.time()
        results = []

        fieldnames = [
            "serialno", "version", "account-id", "interface-id", "srcaddr",
            "dstaddr", "srcport", "dstport", "protocol", "packets", "bytes",
            "starttime", "endtime", "action", "log-status"
        ]

        upload_dir = os.path.join(settings.MEDIA_ROOT, 'events')
        for filename in os.listdir(upload_dir):
            filepath = os.path.join(upload_dir, filename)
            if not os.path.isfile(filepath):
                continue

            with open(filepath, 'r') as file:
                reader = csv.DictReader(file, fieldnames=fieldnames, delimiter=' ')
                for row in reader:
                    try:
                        clean_row = {}
                        for k, v in row.items():
                            if k is not None and v is not None:
                                clean_row[k.strip()] = v.strip()

                        if 'interface-id' in clean_row:
                            clean_row['instance-id'] = clean_row.pop('interface-id')

                        # Filter by search_field and search_value (optional)
                        if search_field and search_value:
                            if search_value.lower() not in clean_row.get(search_field, '').lower():
                                continue

                        # Filter by starttime (optional)
                        try:
                            event_start = int(clean_row.get('starttime', 0))
                        except ValueError:
                            continue

                        if start_time_filter and int(start_time_filter) > event_start:
                            continue
                        if end_time_filter and int(end_time_filter) < event_start:
                            continue

                        results.append({
                            "event": clean_row,
                            "file": filename
                        })

                    except Exception as e:
                        print(f"ERROR while parsing row: {e}")
                        continue

        total_time = round(time.time() - start, 3)

        return Response({
            "search_time_seconds": total_time,
            "total_found": len(results),
            "results": results
        })
