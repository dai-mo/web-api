package org.dcs.web;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

import static org.mockito.Mockito.*;

/**
 * Created by cmathew on 19/01/16.
 */
public class MockFactory {

  private static String TARGET_MARKER = "target";

  public static ServletContext getMockServletContext(final Class testClass, final String webappName) throws Exception {

    ServletContext servletContext = mock(ServletContext.class);
    when(servletContext.getResourceAsStream(anyString())).thenAnswer(new Answer<InputStream>() {


      URL thisUrl = testClass.getResource(".");
      File thisDir = new File(thisUrl.getFile());
      String thisPath = thisDir.getAbsolutePath();

      String webappDirPath = thisPath
              .substring(0, thisPath.indexOf(TARGET_MARKER) +
                      TARGET_MARKER.length())
              .replaceAll(TARGET_MARKER, "target/" + webappName);

      @Override
      public InputStream answer(InvocationOnMock invocation) throws Throwable {
        Object[] args = invocation.getArguments();
        String relativePath = (String) args[0];
        InputStream is = new FileInputStream( webappDirPath + relativePath);
        return is;
      }
    });

    when(servletContext.getResourcePaths(anyString())).thenAnswer(new Answer<Set<String>>() {

      URL thisUrl = this.getClass().getResource(".");
      File thisDir = new File(thisUrl.getFile());
      String thisPath = thisDir.getAbsolutePath();

      String webappDirPath = thisPath
              .substring(0, thisPath.indexOf(TARGET_MARKER) +
                      TARGET_MARKER.length())
              .replaceAll(TARGET_MARKER, "target/dcs");

      @Override
      public Set<String> answer(InvocationOnMock invocation) throws Throwable {
        Object[] args = invocation.getArguments();
        String relativePath = (String) args[0];

        File dir = new File(webappDirPath + relativePath);
        File[] dirContents = dir.listFiles();
        Set<String> dirContentPaths = new HashSet<String>();
        for(File dirContent : dirContents) {
          dirContentPaths.add(dirContent.getAbsolutePath());
        }
        return dirContentPaths;
      }
    });

    when(servletContext.getResource(anyString())).thenAnswer(new Answer<URL>() {

      URL thisUrl = testClass.getResource(".");
      File thisDir = new File(thisUrl.getFile());
      String thisPath = thisDir.getAbsolutePath();

      String webappDirPath = thisPath
              .substring(0, thisPath.indexOf(TARGET_MARKER) +
                      TARGET_MARKER.length())
              .replaceAll(TARGET_MARKER, "target/dcs");

      @Override
      public URL answer(InvocationOnMock invocation) throws Throwable {
        Object[] args = invocation.getArguments();
        String relativePath = (String) args[0];

        return new URL("file://" + relativePath);
      }
    });

    return servletContext;
  }
}
