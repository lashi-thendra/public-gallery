package lk.nlp.gallery.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.GenericFilter;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ServletContext servletContext;

    @GetMapping
    public List<String> getAllImages(UriComponentsBuilder uriBuilder){
        System.out.println("load images controller");
        ArrayList<String> imageFileList = new ArrayList<>();
        String imgDirPath = servletContext.getRealPath("/images");
        File imgDir = new File(imgDirPath);
        String[] imageFileNames = imgDir.list();
        for (String imageFileName : imageFileNames) {
            UriComponentsBuilder clone = uriBuilder.cloneBuilder();
            String url = clone.pathSegment("images",imageFileName).toUriString();
            System.out.println(url);
            imageFileList.add(url);
        }
        return imageFileList;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<String> saveImages(@RequestPart("images")List<Part> imageFiles,
                                   UriComponentsBuilder urlBuilder){
        List<String> imageUrlList = new ArrayList<>();
        if(imageFiles != null){
            String imageDirPath = servletContext.getRealPath("/images");
            for(Part imageFile : imageFiles){
                String imageFilePath =
                        new File(imageDirPath, imageFile.getSubmittedFileName()).getAbsolutePath();
                try {
                    imageFile.write(imageFilePath);
                    UriComponentsBuilder builderClone = urlBuilder.cloneBuilder();
                    builderClone.
                            pathSegment("images", imageFile.getSubmittedFileName()).
                            toUriString();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return  imageUrlList;
    }
}
