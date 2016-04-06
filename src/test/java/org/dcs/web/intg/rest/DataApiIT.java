package org.dcs.web.intg.rest;

import static com.jayway.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.util.UUID;

import org.dcs.api.model.ErrorConstants;
import org.dcs.test.DataUtils;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.path.json.JsonPath;
import com.jayway.restassured.response.Response;

/**
 * Created by cmathew on 28/01/16.
 */
//FIXME: Enable once the e2e test environment
//is configured
@Ignore
public class DataApiIT {
	
	static final Logger logger = LoggerFactory.getLogger(DataApiIT.class);

  @BeforeClass
  public static void setup() {
    RestAssured.port = 9090;
    String portString = System.getProperty("testHttpPort");    
    if(portString != null) {
    	int port = Integer.valueOf(portString);    	
    	RestAssured.port = port;
    }
    logger.warn("Setting port to connect as " + RestAssured.port);
  }

  @Before
  public void preTest() {
    String targetDirectory = DataUtils.getTargetDirectory(this.getClass());
    //DataManagerUtils.deleteDirContents(new File(targetDirectory + File.separator + "data" + File.separator + DataConfiguration.DATA_HOME_DIR_NAME));
  }

  @Test
  public void testDataUpload() {
    String inputFilePath = DataUtils.getDataInputFileAbsolutePath(this.getClass(), "/test.csv");
    Response response = given().multiPart(new File(inputFilePath)).when().post("/dcs/api/v0/data");
    response.body().prettyPrint();
    String json = response.asString();
    UUID data_source_id = JsonPath.from(json).getUUID("data_source_id");
    assertNotNull(data_source_id);
    
    response = given().multiPart(new File(inputFilePath)).when().post("/dcs/api/v0/data");
    response.body().prettyPrint();
    response.then().body("errorCode", equalTo(ErrorConstants.getErrorResponse("DCS101").getCode()));
  }
}
