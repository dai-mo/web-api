package global

import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.mvc._
import play.mvc.Http.MimeTypes

/**
  * Created by cmathew on 02.11.16.
  */
object ResultSerialiserImplicits  extends Results {

  implicit class ObjectToResult(obj: Any)  {
    def toResult(implicit request: Request[AnyContent]): Result = {

      val mimeType = RequestHandler.mimeTypeExt(request)
      if(mimeType.isEmpty)
        request.headers.get("Accept") match {
          case Some(MimeTypes.JSON) => Ok(obj.toJson).as(MimeTypes.JSON)
          case Some(MimeTypes.XML) => NotAcceptable
          case _ => Ok(obj.toJson).as(MimeTypes.JSON)
        }
      else
        mimeType.get match {
          case MimeTypes.JSON => Ok(obj.toJson).as(MimeTypes.JSON)
          case _ => NotAcceptable
        }
    }
  }
}
